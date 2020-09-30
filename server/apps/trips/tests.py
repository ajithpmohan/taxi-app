import pytest
from channels.db import database_sync_to_async
from channels.testing import WebsocketCommunicator
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from rest_framework_simplejwt.tokens import AccessToken

from core.routing import application

User = get_user_model()

TEST_CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'channels.layers.InMemoryChannelLayer',
    },
}


@database_sync_to_async
def create_groups():
    """
    Initialize DRIVER/RIDER Groups
    """
    Group.objects.bulk_create([Group(name='DRIVER'), Group(name='RIDER')])


@database_sync_to_async
def create_user(data):
    """
    Create User
    Return AccessToken
    """
    group = Group.objects.filter(name=data.pop('groups'))
    user = User.objects.create_user(**data)
    user.groups.add(*group)
    access = AccessToken.for_user(user)
    return access


@pytest.mark.asyncio
@pytest.mark.django_db(transaction=True)
class TestTaxiConsumer:
    async def test_cannot_connect_to_server(self, settings):
        """
        AnonymousUser can't able to connect websocket.
        """
        settings.CHANNEL_LAYERS = TEST_CHANNEL_LAYERS
        communicator = WebsocketCommunicator(application=application, path='/ws/trip/')
        connected, _ = await communicator.connect()
        assert connected is False

    async def test_can_connect_to_server(self, settings):
        """
        Only Authenticated User can connect to websocket.
        """
        settings.CHANNEL_LAYERS = TEST_CHANNEL_LAYERS

        await create_groups()

        access = await create_user(
            {
                "email": "rider@example.com",
                "password": "abc12345",
                "first_name": "REJU",
                "last_name": "P MOHAN",
                "groups": "RIDER",
            }
        )
        communicator = WebsocketCommunicator(application=application, path=f'/ws/trip/?token={access}')
        connected, _ = await communicator.connect()
        assert connected
        await communicator.disconnect()

    async def test_can_rider_create_trip(self, settings):
        """
        Test that Rider can create trip.
        """
        settings.CHANNEL_LAYERS = TEST_CHANNEL_LAYERS

        await create_groups()

        access = await create_user(
            {
                "email": "rider@example.com",
                "password": "abc12345",
                "first_name": "REJU",
                "last_name": "P MOHAN",
                "groups": "RIDER",
            }
        )
        communicator = WebsocketCommunicator(application=application, path=f'/ws/trip/?token={access}')
        connected, _ = await communicator.connect()
        assert connected

        message = {
            'type': 'create.trip',
            'data': {
                'pick_up_address': 'Electronic City, Bangalore',
                'drop_off_address': 'Whitefield, Bangalore',
            },
        }
        await communicator.send_json_to(message)
        response = await communicator.receive_json_from()

        assert response['action'] == 'CURRENT_TRIP'
        assert response['payload']['pick_up_address'] == message['data']['pick_up_address']
        assert response['payload']['drop_off_address'] == message['data']['drop_off_address']

        await communicator.disconnect()

    async def test_can_driver_receive_new_trip_requests(self, settings):
        """
        First Rider will create a trip
        Test that newly connected driver can receive rider trip requests.
        """

        settings.CHANNEL_LAYERS = TEST_CHANNEL_LAYERS

        await create_groups()

        # Create a Rider
        access = await create_user(
            {
                "email": "rider@example.com",
                "password": "abc12345",
                "first_name": "REJU",
                "last_name": "P MOHAN",
                "groups": "RIDER",
            }
        )

        # Connect Rider to webconnect
        communicator = WebsocketCommunicator(application=application, path=f'/ws/trip/?token={access}')
        connected, _ = await communicator.connect()
        assert connected

        # data to create trip
        message = {
            'type': 'create.trip',
            'data': {
                'pick_up_address': 'Electronic City, Bangalore',
                'drop_off_address': 'Whitefield, Bangalore',
            },
        }

        # data to create trip
        await communicator.send_json_to(message)

        # Create a Driver
        access = await create_user(
            {
                "email": "driver@example.com",
                "password": "abc12345",
                "first_name": "AJITH",
                "last_name": "P MOHAN",
                "groups": "DRIVER",
            }
        )

        # Connect Driver to webconnect
        communicator = WebsocketCommunicator(application=application, path=f'/ws/trip/?token={access}')
        connected, _ = await communicator.connect()
        assert connected

        response = await communicator.receive_json_from()

        assert response['action'] == 'AVAILABLE_TRIPS'
        assert len(response['payload'])

        await communicator.disconnect()

    async def test_can_rider_receive_ongoing_trip_data_when_reconnected(self, settings):
        """
        Test that Rider receive ongoing trip data when reconnected
        to websocket.
        """
        settings.CHANNEL_LAYERS = TEST_CHANNEL_LAYERS

        await create_groups()

        access = await create_user(
            {
                "email": "rider@example.com",
                "password": "abc12345",
                "first_name": "REJU",
                "last_name": "P MOHAN",
                "groups": "RIDER",
            }
        )
        communicator = WebsocketCommunicator(application=application, path=f'/ws/trip/?token={access}')
        connected, _ = await communicator.connect()
        assert connected

        message = {
            'type': 'create.trip',
            'data': {
                'pick_up_address': 'Electronic City, Bangalore',
                'drop_off_address': 'Whitefield, Bangalore',
            },
        }
        await communicator.send_json_to(message)

        await communicator.disconnect()

        # Rider Reconnecting to WebSocket
        communicator = WebsocketCommunicator(application=application, path=f'/ws/trip/?token={access}')
        connected, _ = await communicator.connect()
        assert connected

        response = await communicator.receive_json_from()

        assert response['action'] == 'CURRENT_TRIP'
        assert response['payload']['pick_up_address'] == message['data']['pick_up_address']
        assert response['payload']['drop_off_address'] == message['data']['drop_off_address']

        await communicator.disconnect()
