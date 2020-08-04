from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncJsonWebsocketConsumer

from apps.trips import serializers as trips_serializers


class TaxiConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        user = self.scope['user']
        if user.is_anonymous:
            await self.close()

        await self.accept()

        if await self._user_group(user) == 'DRIVER':
            await self.channel_layer.group_add(
                'driver',
                self.channel_name
            )

    async def disconnect(self, code):
        user = self.scope['user']

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
        trip = await self._create_trip(content)
        trip_data = trips_serializers.ReadOnlyTripSerializer(trip).data

        # Send rider requests to all drivers.
        await self.channel_layer.group_send('driver', {
                'type': 'echo.message',
                'action': 'TRIP_REQUESTED',
                'payload': trip_data
            }
        )

        await self.echo_message({
            'action': 'TRIP_CREATED',
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
    def _user_group(self, user):
        return user.get_type()
