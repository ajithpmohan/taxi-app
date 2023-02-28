from django.utils.translation import gettext as _
from rest_framework import serializers


class MinimumLengthValidator(object):
    """
    Custom String Min length validator
    """

    def __init__(self, min_length=8):
        self.min_length = min_length

    def __call__(self, password):
        if len(password) < self.min_length:
            raise serializers.ValidationError(
                _(f"This password must contain at least {self.min_length} characters."),
                code='password_too_short',
            )


class MaximumLengthValidator(object):
    """
    Custom String Max length validator
    """

    def __init__(self, max_length=16):
        self.max_length = max_length

    def __call__(self, password):
        if len(password) > self.max_length:
            raise serializers.ValidationError(
                _(f"This password must contain at most {self.max_length} characters."),
                code='password_too_long',
            )
