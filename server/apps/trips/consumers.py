from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncJsonWebsocketConsumer
from django.db.models import Q

from apps.trips import models as trips_models
from apps.trips import serializers as trips_serializers


class TaxiConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        user = self.scope['user']
        if user.is_anonymous:
            await self.close()

        await self.accept()

        # Add user with driver role to `driver` group.
        # Whenever a new trip is created, it will send to all
        # drivers added in the `driver` group
        if await self._user_group(user) == 'DRIVER':
            await self.channel_layer.group_add(
                'driver',
                self.channel_name
            )

        # Check that the user has any ongoing trip. If so, create a unique trip
        # group with trip_id as group name & send that trip details to user.
        trip_data = await self._get_current_trips(user)
        if trip_data:
            # Add user to trip group to handle the ongoing trip between rider & driver
            await self.channel_layer.group_add(
                trip_data['id'],
                self.channel_name
            )

            # Send trip detail to user
            await self.echo_message({
                'action': 'CURRENT_TRIP',
                'payload': trip_data
            })

    async def disconnect(self, code):
        user = self.scope['user']

        # Remove user with driver role from `driver` group.
        if await self._user_group(user) == 'DRIVER':
            await self.channel_layer.group_discard(
                'driver',
                self.channel_name
            )

    async def receive_json(self, event, **kwargs):
        msg_type = event.get('type')
        if msg_type == 'create.trip':
            await self.create_trip(event.get('data'))

    async def create_trip(self, content):
        '''
        Create trip instance
        Send newly created trip data to `driver` group
        Add rider to unique trip group with trip_id as group name
        '''

        trip = await self._create_trip(content)
        trip_data = trips_serializers.ReadOnlyTripSerializer(trip).data

        # Send rider requests to all drivers.
        await self.channel_layer.group_send('driver', {
                'type': 'echo.message',
                'action': 'TRIP_REQUESTED',
                'payload': trip_data
            }
        )

        # Add rider to unique trip group
        user = self.scope['user']
        if await self._user_group(user) == 'RIDER':
            await self.channel_layer.group_add(
                trip_data['id'],
                self.channel_name
            )

        # Send trip detail to rider
        await self.echo_message({
            'action': 'CURRENT_TRIP',
            'payload': trip_data
        })

    async def echo_message(self, event):
        await self.send_json({
            'action': event['action'],
            'payload': event['payload']
        })

    @database_sync_to_async
    def _create_trip(self, content):
        content['rider'] = self.scope['user'].id
        serializer = trips_serializers.TripSerializer(data=content)
        serializer.is_valid(raise_exception=True)
        trip = serializer.create(serializer.validated_data)
        return trip

    @database_sync_to_async
    def _get_current_trips(self, user):
        '''
        Return trip instance if user has any ongoing trip
        '''
        trips = trips_models.Trip.objects.exclude(status=trips_models.Trip.COMPLETED).filter(
            Q(rider=user) | Q(driver=user)
        ).distinct()
        if trips:
            trip_data = trips_serializers.ReadOnlyTripSerializer(trips.get()).data
            return trip_data

    @database_sync_to_async
    def _user_group(self, user):
        '''
        Return Role of User
        '''
        return user.get_role()
