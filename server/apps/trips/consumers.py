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

        # check that user have any ongoing trip
        trip_data = await self._get_current_trips()

        # Add user with driver role to `driver` group only if there is no
        # ongoing trip. Whenever a new trip is created, it will send trip
        # detail to all drivers added in the `driver` group
        if not trip_data and await self._user_group(user) == 'DRIVER':
            await self.channel_layer.group_add('driver', self.channel_name)
            logger.info(f'{user.email} added to driver group.')

            # Send all newly requested trip details to current user with driver role.
            available_trips = await self._get_all_available_trips()
            await self.echo_message({'action': 'AVAILABLE_TRIPS', 'payload': available_trips})
            logger.info(f'Newly Requested trip details sent to {user.email}')

        # If user have any ongoing trip, create a unique trip group with
        # trip_id as group name & send that trip details to user.
        if trip_data:
            # Add user to trip group to handle the ongoing trip between
            # rider & driver
            await self.channel_layer.group_add(trip_data['id'], self.channel_name)

            # Send trip detail to user
            await self.echo_message({'action': 'CURRENT_TRIP', 'payload': trip_data})
            logger.info(f'Ongoing Trip data sent to {user.email}')

    async def disconnect(self, code):
        user = self.scope['user']

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
        # Only user with rider role can create trip
        if msg_type == 'create.trip' and await self._user_group(user) == 'RIDER':
            await self.create_trip(event.get('data'))
        # Only user with driver role can create trip
        elif msg_type == 'accept.pickup' and await self._user_group(user) == 'DRIVER':
            await self.accept_pickup(event.get('data'))

    async def echo_message(self, event):
        """
        function actually send action & payload
        to corresponding user.
        """
        await self.send_json({'action': event['action'], 'payload': event['payload']})

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
            'driver', {'type': 'echo.message', 'action': 'NEW_TRIP', 'payload': trip_data}
        )
        logger.info('New rider trip request sent to all drivers.')

        # Add rider to unique trip group
        user = self.scope['user']
        if await self._user_group(user) == 'RIDER':
            await self.channel_layer.group_add(trip_data['id'], self.channel_name)

        # Send trip detail to rider
        await self.echo_message({'action': 'CURRENT_TRIP', 'payload': trip_data})

    @database_sync_to_async
    def _create_trip(self, content):
        """
        Create & return trip instance
        """
        content['rider'] = self.scope['user'].id

        # Walrus operator
        (serializer := trips_serializers.TripSerializer(data=content)).is_valid(raise_exception=True)
        trip = serializer.create(serializer.validated_data)
        return trip

    async def accept_pickup(self, payload):
        """
        Check that driver has any ongoing trip.
        If not, assign driver to trip instance
        Add driver to unique trip group
        Send driver assigned message to both rider & driver
        """
        user = self.scope['user']

        if not await self._get_current_trips():
            if await self._accept_trip(payload):
                trip_data = await self._get_current_trips()

                # Assign driver to trip instance unique group.
                await self.channel_layer.group_add(trip_data['id'], self.channel_name)
                logger.info('Driver added to unique trip group.')

                # Before sending driver assigned messages, discard current user from `driver` group.
                # So a new trip request can't be sent to the driver until the current trip goes complete.
                # Remove user with driver role from `driver` group.
                if await self._user_group(user) == 'DRIVER':
                    await self.channel_layer.group_discard('driver', self.channel_name)
                    logger.info(f'{user.get_email()} removed from driver group.')

                # Send driver assigned & ready to pickup messages to rider & driver.
                await self.channel_layer.group_send(
                    trip_data['id'], {'type': 'echo.message', 'action': 'CURRENT_TRIP', 'payload': trip_data}
                )
                logger.info('Driver assigned & Ready to pickup.')
            else:
                logger.info('Another Driver is already assigned.')
        else:
            logger.info('Driver already have ongoing trip.')

    @database_sync_to_async
    def _accept_trip(self, payload):
        """
        Check that if trip is taken by any other driver.
        If not, assign `current user` as driver & change status to STARTED.
        """
        return trips_models.Trip.objects.filter(
            id=payload['id'], status=trips_models.Trip.REQUESTED, driver=None
        ).update(status=trips_models.Trip.STARTED, driver=self.scope['user'])

    @database_sync_to_async
    def _get_all_available_trips(self):
        """
        Get all newly requested trip which is not taken by any other driver.
        """
        trips = trips_models.Trip.objects.filter(status=trips_models.Trip.REQUESTED, driver=None)
        return trips_serializers.ReadOnlyTripSerializer(trips, many=True).data

    @database_sync_to_async
    def _get_current_trips(self):
        """
        Get trip instance if user has any ongoing trip
        """
        user = self.scope['user']
        trips = (
            trips_models.Trip.objects.exclude(status=trips_models.Trip.COMPLETED)
            .filter(Q(rider=user) | Q(driver=user))
            .distinct()
        )
        if trips:
            trip_data = trips_serializers.ReadOnlyTripSerializer(trips.get()).data
            return trip_data

    @database_sync_to_async
    def _user_group(self, user):
        """
        Return Role of User
        """
        return user.get_role()
