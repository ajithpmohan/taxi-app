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
def create_user(data):
    """
    Initialize DRIVER/RIDER Groups
    """
    Group.objects.bulk_create([Group(name='DRIVER'), Group(name='RIDER')])

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
    async def test_can_connect_to_server(self, settings):

        settings.CHANNEL_LAYERS = TEST_CHANNEL_LAYERS
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

    async def test_can_create_trip(self, settings):
        settings.CHANNEL_LAYERS = TEST_CHANNEL_LAYERS
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

        assert response['payload']['pick_up_address'] == message['data']['pick_up_address']
        assert response['payload']['drop_off_address'] == message['data']['drop_off_address']

        await communicator.disconnect()
