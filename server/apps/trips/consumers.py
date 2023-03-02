import logging

from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncJsonWebsocketConsumer
from django.db.models import Q

from apps.trips import models as trips_models
from apps.trips import serializers as trips_serializers

# Get an instance of a logger
logger = logging.getLogger(__name__)


class TaxiConsumer(AsyncJsonWebsocketConsumer):
    """
    Establish WebSocket connection to all riders & drivers.
    Handle realtime trip events from trip creation to completion.
    """

    async def connect(self):
        if (user := self.scope['user']).is_anonymous:
            await self.close()

        await self.accept()
        logger.info(f'{user.email} connected to websocket.')

        # Send all previously completed trip details to user.
        await self._send_recent_trips(user)

        # check that user have any ongoing trip
        trip_data = await self._get_current_trip(user)

        # If the below condition met, the `send_available_trips` func add user
        # with driver role to `driver` group & send all available trips to
        # `driver` group
        if not trip_data and await self._user_group(user) == 'DRIVER':
            await self._send_available_trips(user)

        # If user have any ongoing trip, create a unique trip group with
        # trip_id as group name & send that trip details to user.
        if trip_data:
            # Add user to trip group to handle the ongoing trip between
            # rider & driver
            await self.channel_layer.group_add(trip_data.get('id'), self.channel_name)

            # Send trip detail to user
            await self.echo_message({'action': 'SET_CURRENT_TRIP', 'payload': trip_data})
            logger.info(f'Ongoing Trip data sent to {user.email}')

    async def disconnect(self, code):
        user = self.scope['user']

        # If user has any ongoing trip, discard them from trip unique group.
        trip_data = await self._get_current_trip(user)
        if trip_data:
            await self.channel_layer.group_discard(trip_data.get('id'), self.channel_name)

        # Remove user with driver role from `driver` group.
        if await self._user_group(user) == 'DRIVER':
            await self.channel_layer.group_discard('driver', self.channel_name)
            logger.info(f'{user.email} removed from driver group.')

    async def receive_json(self, event, **kwargs):
        """
        Function receive any event send to consumer.
        Json Payload contain type & data attributes.
        Based on the type, pass the data to appropriate handler.
        """
        user = self.scope['user']

        msg_type = event.get('type')
        # rider can only create trip
        if msg_type == 'create.trip' and await self._user_group(user) == 'RIDER':
            await self.create_trip(event.get('data'))
        # driver can only able to change trip status
        elif await self._user_group(user) == 'DRIVER':
            if msg_type == 'trip.pickup':
                await self.accept_pickup(event.get('data'))
            elif msg_type == 'trip.dropoff':
                await self.accept_dropoff(event.get('data'))
            elif msg_type == 'trip.complete':
                await self.complete_trip(event.get('data'))

    async def echo_message(self, event):
        """
        Function actually send action & payload
        to corresponding user.
        """
        message = {'action': event['action']}
        if 'payload' in event:
            message.update({'payload': event['payload']})
        await self.send_json(message)

    async def create_trip(self, content):
        """
        Create trip instance
        Send newly created trip data to `driver` group
        Add rider to unique trip group with trip_id as group name
        """
        trip = await self._create_trip(content)
        trip_data = trips_serializers.ReadOnlyTripSerializer(trip).data

        # Send rider requests to all drivers.
        await self.channel_layer.group_send(
            'driver',
            {'type': 'echo.message', 'action': 'UPDATE_AVAILABLE_TRIPS', 'payload': trip_data},
        )
        logger.info('New rider trip request sent to all drivers.')

        # Add rider to unique trip group
        user = self.scope['user']
        if await self._user_group(user) == 'RIDER':
            await self.channel_layer.group_add(trip_data.get('id'), self.channel_name)

        # Send trip detail to rider
        await self.echo_message({'action': 'SET_CURRENT_TRIP', 'payload': trip_data})

    @database_sync_to_async
    def _create_trip(self, content):
        """
        Create & return trip instance
        """
        content['rider'] = self.scope['user'].id

        # Walrus operator
        (serializer := trips_serializers.TripSerializer(data=content)).is_valid(
            raise_exception=True
        )
        trip = serializer.create(serializer.validated_data)
        return trip

    async def accept_pickup(self, payload):
        """
        Driver accepting Trip request & heading to pickup the rider.
        Check that driver has any ongoing trip.
        If not, assign driver to trip instance
        Add driver to unique trip group
        Send driver assigned message to both rider & driver
        """
        user = self.scope['user']

        if not await self._get_current_trip(user):
            # Driver Accepting Trip. Trip Status changed from `REQUESTED` to `STARTED`.
            if await self._accept_pickup(payload, user):
                # GET Driver's ongoing trip data.
                trip_data = await self._get_current_trip(user)

                # Assign driver to trip instance unique group.
                await self.channel_layer.group_add(trip_data.get('id'), self.channel_name)
                logger.info('Driver added to unique trip group.')

                # Before sending driver assigned messages, discard current user
                # from `driver` group. So a new trip request can't be sent to the
                # driver until the current trip goes complete. Remove user with
                # driver role from `driver` group.
                if await self._user_group(user) == 'DRIVER':
                    await self.channel_layer.group_discard('driver', self.channel_name)
                    logger.info(f'{user.get_email()} removed from driver group.')

                # Send driver assigned & ready to pickup messages to both rider & driver.
                await self.channel_layer.group_send(
                    trip_data.get('id'),
                    {'type': 'echo.message', 'action': 'SET_CURRENT_TRIP', 'payload': trip_data},
                )
                logger.info('Driver assigned & Ready to pickup.')
            else:
                logger.info('Another Driver is already assigned.')
        else:
            logger.info('Driver already have ongoing trip.')

    @database_sync_to_async
    def _accept_pickup(self, payload, user):
        """
        Check that if trip is taken by any other driver.
        If not, assign `current user` as driver & change status to STARTED.
        """
        return trips_models.Trip.objects.filter(
            id=payload.get('id'), status=trips_models.Trip.REQUESTED, driver=None
        ).update(status=trips_models.Trip.STARTED, driver=user)

    async def accept_dropoff(self, payload):
        """
        Driver picked up the rider & heading to destination.
        Update Trip Status to `IN_PROGRESS` & send it to trip unique group.
        """
        user = self.scope['user']

        # Driver Updating Trip Status from `STARTED` to `IN_PROGRESS`
        if await self._accept_dropoff(payload, user):
            # GET Driver's ongoing trip data.
            trip_data = await self._get_current_trip(user)

            # Send trip instance to both rider & driver.
            await self.channel_layer.group_send(
                trip_data.get('id'),
                {'type': 'echo.message', 'action': 'SET_CURRENT_TRIP', 'payload': trip_data},
            )
            logger.info('Driver updated trip status to `IN_PROGRESS`.')
        else:
            logger.info('Driver is unauthorized to update trip status.')

    @database_sync_to_async
    def _accept_dropoff(self, payload, user):
        """
        Check the two conditions are satisfying, then change trip status to `IN_PROGRESS`.
        a) Current user is assigned as driver to this trip.
        b) Trip current status is STARTED.
        """
        return trips_models.Trip.objects.filter(
            id=payload.get('id'), status=trips_models.Trip.STARTED, driver=user
        ).update(status=trips_models.Trip.IN_PROGRESS)

    async def complete_trip(self, payload):
        """
        Update Trip Status to `COMPLETED`.
        Send Trip Completed message to trip unique group.
        Discard Driver from trip unique group.
        Then add user to `driver` group for getting new trip requests
        Send available trips to driver.
        """
        user = self.scope['user']

        # Driver Updating Trip Status to `COMPLETED`.
        if await self._complete_trip(payload, user):
            logger.info('Driver updated trip status to `COMPLETED`.')

            # Clear current trip of both rider & driver.
            await self.channel_layer.group_send(
                payload.get('id'), {'type': 'echo.message', 'action': 'CLEAR_CURRENT_TRIP'}
            )
            logger.info('Clear current Trip on both rider & driver')

            trip_data = await self._get_trip(payload, user)

            if trip_data:
                # Update recent trips
                await self.channel_layer.group_send(
                    payload.get('id'),
                    {
                        'type': 'echo.message',
                        'action': 'UPDATE_RECENT_TRIPS',
                        'payload': trip_data,
                    },
                )
                logger.info('Recent trips updated on both rider & driver')

            # Discard Driver from trip unique group.
            await self.channel_layer.group_discard(payload.get('id'), self.channel_name)
            logger.info('Driver discarded from current trip group.')

            # If the below condition met, the `send_available_trips` func add user with
            # driver role to `driver` group & send all available trips to
            # `driver` group.
            # Here user role checking is not needed. `complete_trip` func already verify
            # that user is driver.
            if not await self._get_current_trip(user):
                await self._send_available_trips(user)

        else:
            logger.info('Driver is unauthorized to update trip status.')

    @database_sync_to_async
    def _complete_trip(self, payload, user):
        """
        Check the two conditions are satisfying, then change trip status to `COMPLETED`.
        a) Current user is assigned as driver to this trip.
        b) Trip's current status is IN_PROGRESS.
        """
        return trips_models.Trip.objects.filter(
            id=payload.get('id'), status=trips_models.Trip.IN_PROGRESS, driver=user
        ).update(status=trips_models.Trip.COMPLETED)

    @database_sync_to_async
    def _get_current_trip(self, user):
        """
        Get trip instance if user has any ongoing trip
        """
        trips = (
            trips_models.Trip.objects.exclude(status=trips_models.Trip.COMPLETED)
            .filter(Q(rider=user) | Q(driver=user))
            .distinct()
        )

        if trips:
            trip_data = trips_serializers.ReadOnlyTripSerializer(trips.get()).data
            return trip_data

    @database_sync_to_async
    def _get_available_trips(self):
        """
        Get all newly requested trip which is not taken by any other driver.
        """
        trips = trips_models.Trip.objects.filter(status=trips_models.Trip.REQUESTED, driver=None)
        return trips_serializers.ReadOnlyTripSerializer(trips, many=True).data

    @database_sync_to_async
    def _get_recent_trips(self, user):
        """
        Get all previously completed trip detail of current user.
        """
        trips = trips_models.Trip.objects.filter(
            Q(status=trips_models.Trip.COMPLETED) & (Q(driver=user) | Q(rider=user))
        ).distinct()
        return trips_serializers.ReadOnlyTripSerializer(trips, many=True).data

    @database_sync_to_async
    def _get_trip(self, payload, user):
        """
        Get trip instance by id & user
        """
        trips = trips_models.Trip.objects.filter(id=payload.get('id'), driver=user)

        if trips:
            trip_data = trips_serializers.ReadOnlyTripSerializer(trips.get()).data
            return trip_data

    @database_sync_to_async
    def _user_group(self, user):
        """
        Return Role of User
        """
        return user.get_role()

    async def _send_available_trips(self, user):
        """
        Add user to `driver` group.
        Send all newly requested trip details to user whose role is `DRIVER`.
        """
        await self.channel_layer.group_add('driver', self.channel_name)
        logger.info(f'{user.email} added to driver group.')

        available_trips = await self._get_available_trips()
        await self.echo_message({'action': 'SET_AVAILABLE_TRIPS', 'payload': available_trips})
        logger.info(f'Newly Requested trip details sent to {user.email}')

    async def _send_recent_trips(self, user):
        """
        Send all previous trips to user.
        """
        recent_trips = await self._get_recent_trips(user)
        await self.echo_message({'action': 'SET_RECENT_TRIPS', 'payload': recent_trips})
        logger.info(f'Send all previous trips to {user.email}')
