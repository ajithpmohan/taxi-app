import string

from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from django.urls import reverse
from parameterized import parameterized
from rest_framework import status
from rest_framework.test import APITestCase

User = get_user_model()


class SignupTest(APITestCase):
    """
    Signup Integration Test
    """

    @classmethod
    def setUpTestData(cls):
        """
        Initialize DRIVER/RIDER Groups
        """
        Group.objects.bulk_create([Group(name='DRIVER'), Group(name='RIDER')])

    @parameterized.expand(
        [
            (
                {
                    "email": "driver@example.com",
                    "password": "abc123",
                    "password2": "abc123",
                    "first_name": "AJITH",
                    "last_name": "P MOHAN",
                    "groups": "DRIVER",
                },
            ),
            (
                {
                    "email": "rider@example.com",
                    "password": "abc1234",
                    "password2": "abc1234",
                    "first_name": "REJU",
                    "last_name": "P MOHAN",
                    "groups": "RIDER",
                },
            ),
        ]
    )
    def test_password_minlength_subceed(self, data):
        """
        TestCase to verify that password minlength is not subceeded.
        """
        self.assertEqual(User.objects.count(), 0)

        response = self.client.post(reverse('account:sign_up'), data=data)

        self.assertEqual(User.objects.count(), 0)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['password'][0].code, 'password_too_short')

    @parameterized.expand(
        [
            (
                {
                    "email": "driver@example.com",
                    "password": string.ascii_lowercase,
                    "password2": string.ascii_lowercase,
                    "first_name": "AJITH",
                    "last_name": "P MOHAN",
                    "groups": "DRIVER",
                },
            ),
            (
                {
                    "email": "rider@example.com",
                    "password": string.ascii_uppercase,
                    "password2": string.ascii_uppercase,
                    "first_name": "REJU",
                    "last_name": "P MOHAN",
                    "groups": "RIDER",
                },
            ),
        ]
    )
    def test_password_maxlength_exceed(self, data):
        """
        TestCase to verify that password maxlength is not exceeded.
        """
        self.assertEqual(User.objects.count(), 0)

        response = self.client.post(reverse('account:sign_up'), data=data)

        self.assertEqual(User.objects.count(), 0)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['password'][0].code, 'password_too_long')

    @parameterized.expand(
        [
            (
                {
                    "email": "driver@example.com",
                    "password": "abc123457",
                    "password2": "abc123456",
                    "first_name": "AJITH",
                    "last_name": "P MOHAN",
                    "groups": "DRIVER",
                },
            ),
            (
                {
                    "email": "rider@example.com",
                    "password": "abc12345",
                    "password2": "abc123456",
                    "first_name": "REJU",
                    "last_name": "P MOHAN",
                    "groups": "RIDER",
                },
            ),
        ]
    )
    def test_password_must_match(self, data):
        """
        TestCase to verify that password, password2 data mismatching should
        raise 404 Bad Request.
        """
        self.assertEqual(User.objects.count(), 0)

        response = self.client.post(reverse('account:sign_up'), data=data)

        self.assertEqual(User.objects.count(), 0)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['password'][0], 'Passwords must match.')

    @parameterized.expand(
        [
            (
                {
                    "email": "admin@example.com",
                    "password": "abc12345",
                    "password2": "abc12345",
                    "first_name": "AJITH",
                    "last_name": "P MOHAN",
                    "groups": "ADMIN",
                },
            ),
            (
                {
                    "email": "staff@example.com",
                    "password": "abc12345",
                    "password2": "abc123456",
                    "first_name": "REJU",
                    "last_name": "P MOHAN",
                    "groups": "STAFF",
                },
            ),
        ]
    )
    def test_invalid_group(self, data):
        """
        TestCase to verify that USER GROUPS other than DRIVER/RIDER should
        raise 404 Bad Request.
        """
        self.assertEqual(User.objects.count(), 0)

        response = self.client.post(reverse('account:sign_up'), data=data)

        self.assertEqual(User.objects.count(), 0)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['groups'][0], 'This field must be either DRIVER or RIDER')

    @parameterized.expand(
        [
            (
                {
                    "email": "driver@example.com",
                    "password": "abc12345",
                    "password2": "abc12345",
                    "first_name": "AJITH",
                    "last_name": "P MOHAN",
                    "groups": "DRIVER",
                },
            ),
            (
                {
                    "email": "rider@example.com",
                    "password": "abc12345",
                    "password2": "abc12345",
                    "first_name": "REJU",
                    "last_name": "P MOHAN",
                    "groups": "RIDER",
                },
            ),
        ]
    )
    def test_can_signup(self, data):
        """
        Can User Signup.
        """
        self.assertEqual(User.objects.count(), 0)

        response = self.client.post(reverse('account:sign_up'), data=data)

        self.assertEqual(User.objects.count(), 1)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['message'], f'Account activation email sent to {data["email"]}')


class TokenObtainTest(APITestCase):
    """
    Signin Integration Test
    """

    @classmethod
    def setUpTestData(cls):
        """
        Initialize DRIVER/RIDER Groups
        """
        Group.objects.bulk_create([Group(name='DRIVER'), Group(name='RIDER')])

    @parameterized.expand(
        [
            (
                {
                    "email": "driver@example.com",
                    "password": "abc12345",
                    "password2": "abc12345",
                    "first_name": "AJITH",
                    "last_name": "P MOHAN",
                    "groups": "DRIVER",
                },
                {
                    "email": "driver@example.com",
                    "password": "abc12345",
                },
            ),
            (
                {
                    "email": "rider@example.com",
                    "password": "abc123456",
                    "password2": "abc123456",
                    "first_name": "REJU",
                    "last_name": "P MOHAN",
                    "groups": "RIDER",
                },
                {
                    "email": "rider@example.com",
                    "password": "abc123456",
                },
            ),
        ]
    )
    def test_obtain_token(self, signup_data, signin_data):
        """
        Can User SignIn.
        Return Access, Refresh Token pair for valid cases
        """
        self.assertEqual(User.objects.count(), 0)

        self.client.post(reverse('account:sign_up'), data=signup_data)

        self.assertEqual(User.objects.count(), 1)

        response = self.client.post(
            reverse("account:token_obtain_pair"),
            data=signin_data,
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue('access' in response.data)
        self.assertTrue('refresh' in response.data)
        self.assertEqual(
            response.data['user'],
            {
                'email': signup_data['email'],
                'fullname': f'{signup_data["first_name"]} {signup_data["last_name"]}',
                'avatar': None,
                'role': signup_data['groups'],
            },
        )
