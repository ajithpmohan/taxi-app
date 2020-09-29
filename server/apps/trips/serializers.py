from rest_framework import serializers

from apps.account import serializers as account_serializers
from apps.trips.models import Trip


class TripSerializer(serializers.ModelSerializer):
    """
    Trip Serializer used to create/update trips
    """

    class Meta:
        model = Trip
        fields = '__all__'
        read_only_fields = (
            'id',
            'created',
            'updated',
        )


class ReadOnlyTripSerializer(serializers.ModelSerializer):
    """
    Trip Read only Serializer used to send trip data to users when requested.
    Accept: GET Request Only
    """

    driver = account_serializers.ReadOnlyUserSerializer(read_only=True)
    rider = account_serializers.ReadOnlyUserSerializer(read_only=True)

    class Meta:
        model = Trip
        fields = '__all__'
