import string

from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

User = get_user_model()


class SignupTest(APITestCase):
    """
    Signup UnitTests
    """

    @classmethod
    def setUpTestData(cls):
        """
        Initialize DRIVER/RIDER Groups
        """
        Group.objects.bulk_create([Group(name='DRIVER'), Group(name='RIDER')])

    def test_password_minlength_subceed(self):
        data = {
            "email": "rider@example.com",
            "password": "abc1234",
            "password2": "abc1234",
            "first_name": "AJITH",
            "last_name": "P MOHAN",
            "groups": "RIDER",
        }
        self.assertEqual(User.objects.count(), 0)

        response = self.client.post(reverse('account:sign_up'), data=data)

        self.assertEqual(User.objects.count(), 0)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['password'][0].code, 'password_too_short')

    def test_password_maxlength_exceed(self):
        data = {
            "email": "rider@example.com",
            "password": string.ascii_lowercase,
            "password2": string.ascii_lowercase,
            "first_name": "AJITH",
            "last_name": "P MOHAN",
            "groups": "RIDER",
        }
        self.assertEqual(User.objects.count(), 0)

        response = self.client.post(reverse('account:sign_up'), data=data)

        self.assertEqual(User.objects.count(), 0)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['password'][0].code, 'password_too_long')

    def test_password_must_match(self):
        data = {
            "email": "rider@example.com",
            "password": "abc12345",
            "password2": "abc123456",
            "first_name": "AJITH",
            "last_name": "P MOHAN",
            "groups": "RIDER",
        }
        self.assertEqual(User.objects.count(), 0)

        response = self.client.post(reverse('account:sign_up'), data=data)

        self.assertEqual(User.objects.count(), 0)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['password'][0], 'Passwords must match.')

    def test_invalid_group(self):
        data = {
            "email": "rider@example.com",
            "password": "abc12345",
            "password2": "abc12345",
            "first_name": "AJITH",
            "last_name": "P MOHAN",
            "groups": "ADMIN",
        }
        self.assertEqual(User.objects.count(), 0)

        response = self.client.post(reverse('account:sign_up'), data=data)

        self.assertEqual(User.objects.count(), 0)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['groups'][0], 'This field must be either DRIVER or RIDER')

    def test_can_signup(self):
        data = {
            "email": "rider@example.com",
            "password": "abc12345",
            "password2": "abc12345",
            "first_name": "AJITH",
            "last_name": "P MOHAN",
            "groups": "RIDER",
        }
        self.assertEqual(User.objects.count(), 0)

        response = self.client.post(reverse('account:sign_up'), data=data)

        self.assertEqual(User.objects.count(), 1)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['message'], 'Account activation email sent to rider@example.com')


class TokenObtainTest(APITestCase):
    @classmethod
    def setUpTestData(cls):
        Group.objects.bulk_create([Group(name='DRIVER'), Group(name='RIDER')])

    def test_obtain_token(self):

        data = {
            "email": "driver@example.com",
            "password": "abc12345",
            "password2": "abc12345",
            "first_name": "REGI",
            "last_name": "P MOHAN",
            "groups": "DRIVER",
        }
        self.assertEqual(User.objects.count(), 0)

        self.client.post(reverse('account:sign_up'), data=data)

        self.assertEqual(User.objects.count(), 1)

        response = self.client.post(
            reverse("account:token_obtain_pair"),
            data={
                "email": "driver@example.com",
                "password": "abc12345",
            },
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue('access' in response.data)
        self.assertTrue('refresh' in response.data)
        self.assertEqual(
            response.data['user'],
            {'email': 'driver@example.com', 'fullname': 'REGI P MOHAN', 'avatar': None, 'role': 'DRIVER'},
        )
