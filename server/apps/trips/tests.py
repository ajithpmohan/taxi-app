import pytest
from channels.db import database_sync_to_async
from channels.testing import WebsocketCommunicator
from django.contrib.auth import authenticate, get_user_model
from django.contrib.auth.models import Group
from rest_framework_simplejwt.tokens import AccessToken

from apps.trips import models as trips_models
from core.routing import application

User = get_user_model()

TEST_CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'channels.layers.InMemoryChannelLayer',
    },
}


def channel_layer(settings):
    settings.CHANNEL_LAYERS = TEST_CHANNEL_LAYERS


def get_access_token(user):
    """
    Return AccessToken
    """
    return AccessToken.for_user(user)


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
    """
    group = Group.objects.filter(name=data.pop('groups'))
    user = User.objects.create_user(**data)
    user.groups.add(*group)
    return get_access_token(user)


@database_sync_to_async
def authenticate_user(email, password):
    """
    Return Authenticated User
    """
    return authenticate(email=email, password=password)


@pytest.mark.asyncio
@pytest.mark.django_db(transaction=True)
class TestTaxiConsumer:
    async def connect_user_to_websocket(self, access):
        # Connect user to websocket
        communicator = WebsocketCommunicator(
            application=application, path=f'/ws/trip/?token={access}'
        )
        connected, _ = await communicator.connect()
        assert connected

        return communicator

    async def create_rider(self):
        # Create a Rider
        access = await create_user(
            {
                "email": "rider@example.com",
                "password": "secret",
                "first_name": "REJU",
                "last_name": "P MOHAN",
                "groups": "RIDER",
            }
        )

        return await self.connect_user_to_websocket(access)

    async def create_driver(self):

        # Create a Driver
        access = await create_user(
            {
                "email": "driver@example.com",
                "password": "secret",
                "first_name": "AJITH",
                "last_name": "P MOHAN",
                "groups": "DRIVER",
            }
        )

        return await self.connect_user_to_websocket(access)

    async def create_trip(self, communicator):

        # data to create trip
        message = {
            'type': 'create.trip',
            'data': {
                'pick_up_address': 'Electronic City, Bangalore',
                'drop_off_address': 'Whitefield, Bangalore',
            },
        }

        # send data to consumer
        await communicator.send_json_to(message)
        return message

    async def accept_pickup(self, communicator, trip_id):

        message = {
            'type': 'trip.pickup',
            'data': {
                'id': trip_id,
            },
        }
        # send data to consumer
        await communicator.send_json_to(message)

    async def accept_dropoff(self, communicator, trip_id):

        message = {
            'type': 'trip.dropoff',
            'data': {
                'id': trip_id,
            },
        }
        # send data to consumer
        await communicator.send_json_to(message)

    async def complete_trip(self, communicator, trip_id):

        message = {
            'type': 'trip.complete',
            'data': {
                'id': trip_id,
            },
        }
        # send data to consumer
        await communicator.send_json_to(message)

    async def test_cannot_connect_to_websocket(self, settings):
        """
        AnonymousUser can't able to connect websocket.
        """
        channel_layer(settings)

        communicator = WebsocketCommunicator(application=application, path='/ws/trip/')
        connected, _ = await communicator.connect()
        assert connected is False

    async def test_can_connect_to_websocket(self, settings):
        """
        Only Authenticated User can connect to websocket.
        """
        channel_layer(settings)

        await create_groups()

        # Create & connect a rider to websocket
        communicator = await self.create_rider()

        # disconnect rider
        await communicator.disconnect()

    async def test_can_rider_create_trip(self, settings):
        """
        Test that Rider can create trip.
        """
        channel_layer(settings)

        await create_groups()

        # Create & connect a rider to websocket
        communicator = await self.create_rider()
        response = await communicator.receive_json_from()
        assert response['action'] == 'SET_RECENT_TRIPS'
        assert len(response['payload']) == 0

        # Send a Trip to consumer
        message = await self.create_trip(communicator)

        # Receive data from consumer
        response = await communicator.receive_json_from()

        assert response['action'] == 'SET_CURRENT_TRIP'
        assert response['payload']['pick_up_address'] == message['data']['pick_up_address']
        assert response['payload']['drop_off_address'] == message['data']['drop_off_address']

        # disconnect rider
        await communicator.disconnect()

    async def test_can_driver_receive_new_trip_requests(self, settings):
        """
        First Rider will create a trip
        Test that newly connected driver can receive rider trip requests.
        """

        channel_layer(settings)

        await create_groups()

        # Create & connect a rider to server
        communicator = await self.create_rider()

        # Send a Trip to consumer
        await self.create_trip(communicator)

        # disconnect rider
        await communicator.disconnect()

        # Create & connect a driver to server
        communicator = await self.create_driver()

        # Receive data from consumer
        response = await communicator.receive_json_from()
        assert response['action'] == 'SET_RECENT_TRIPS'
        assert len(response['payload']) == 0

        # Receive data from consumer
        response = await communicator.receive_json_from()
        assert response['action'] == 'SET_AVAILABLE_TRIPS'
        assert len(response['payload'])

        # disconnect driver
        await communicator.disconnect()

    async def test_can_rider_receive_ongoing_trip_data_when_reconnected(self, settings):
        """
        Test that Rider receive ongoing trip data when reconnected
        to websocket.
        """
        channel_layer(settings)

        await create_groups()

        # Create & connect a rider to server
        communicator = await self.create_rider()

        # Send a Trip to consumer
        message = await self.create_trip(communicator)

        # disconnect rider
        await communicator.disconnect()

        # Authenticate rider
        user = await authenticate_user(email='rider@example.com', password='secret')

        # Get access token
        access = get_access_token(user)

        communicator = await self.connect_user_to_websocket(access)

        # Receive data from consumer
        response = await communicator.receive_json_from()
        assert response['action'] == 'SET_RECENT_TRIPS'
        assert len(response['payload']) == 0

        # Receive data from consumer
        response = await communicator.receive_json_from()
        assert response['action'] == 'SET_CURRENT_TRIP'
        assert response['payload']['pick_up_address'] == message['data']['pick_up_address']
        assert response['payload']['drop_off_address'] == message['data']['drop_off_address']

        await communicator.disconnect()

    async def test_trip_workflow(self, settings):
        """
        Test that Driver can accept new trip
        """
        channel_layer(settings)

        await create_groups()

        # Create & connect a rider to server
        rider_communicator = await self.create_rider()

        # Send a Trip to consumer
        message = await self.create_trip(rider_communicator)

        # Rider receive data from consumer
        response = await rider_communicator.receive_json_from()
        assert response['action'] == 'SET_RECENT_TRIPS'
        assert len(response['payload']) == 0

        # Rider receive data from consumer
        response = await rider_communicator.receive_json_from()
        assert response['action'] == 'SET_CURRENT_TRIP'
        assert response['payload']['pick_up_address'] == message['data']['pick_up_address']
        assert response['payload']['drop_off_address'] == message['data']['drop_off_address']

        # Create & connect a driver to server
        driver_communicator = await self.create_driver()

        # Driver receive data from consumer
        response = await driver_communicator.receive_json_from()
        assert response['action'] == 'SET_RECENT_TRIPS'
        assert len(response['payload']) == 0

        # Driver receive data from consumer
        response = await driver_communicator.receive_json_from()
        assert response['action'] == 'SET_AVAILABLE_TRIPS'
        assert len(response['payload'])

        '''
        Driver accepting Trip request & heading to pickup the rider
        '''
        trip_id = response['payload'][0]['id']
        await self.accept_pickup(driver_communicator, trip_id)

        # Driver receive data from consumer
        response = await driver_communicator.receive_json_from()
        assert response['action'] == 'SET_CURRENT_TRIP'
        assert response['payload']['status'] == trips_models.Trip.STARTED
        assert response['payload']['driver']['email'] == 'driver@example.com'

        # Rider receive data from consumer
        response = await rider_communicator.receive_json_from()
        assert response['action'] == 'SET_CURRENT_TRIP'
        assert response['payload']['status'] == trips_models.Trip.STARTED
        assert response['payload']['driver']['email'] == 'driver@example.com'

        '''
        Driver picked up the rider & heading to destination
        '''
        await self.accept_dropoff(driver_communicator, trip_id)

        # Driver receive data from consumer
        response = await driver_communicator.receive_json_from()
        assert response['action'] == 'SET_CURRENT_TRIP'
        assert response['payload']['status'] == trips_models.Trip.IN_PROGRESS

        # Rider receive data from consumer
        response = await rider_communicator.receive_json_from()
        assert response['action'] == 'SET_CURRENT_TRIP'
        assert response['payload']['status'] == trips_models.Trip.IN_PROGRESS

        '''
        Destination reached & Trip is completed.
        '''
        await self.complete_trip(driver_communicator, trip_id)

        # Driver receive data from consumer
        response = await driver_communicator.receive_json_from()
        assert response['action'] == 'SET_AVAILABLE_TRIPS'
        assert len(response['payload']) == 0

        # Driver receive data from consumer
        response = await driver_communicator.receive_json_from()
        assert response['action'] == 'CLEAR_CURRENT_TRIP'

        # Driver receive data from consumer
        response = await driver_communicator.receive_json_from()
        assert response['action'] == 'UPDATE_RECENT_TRIPS'
        assert response['payload']['id'] == trip_id
        assert response['payload']['status'] == trips_models.Trip.COMPLETED

        # Rider receive data from consumer
        response = await rider_communicator.receive_json_from()
        assert response['action'] == 'CLEAR_CURRENT_TRIP'

        # Rider receive data from consumer
        response = await rider_communicator.receive_json_from()
        assert response['action'] == 'UPDATE_RECENT_TRIPS'
        assert response['payload']['id'] == trip_id
        assert response['payload']['status'] == trips_models.Trip.COMPLETED

        # disconnect driver
        await driver_communicator.disconnect()

        # disconnect rider
        await rider_communicator.disconnect()
