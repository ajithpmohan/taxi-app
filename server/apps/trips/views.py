from rest_framework import permissions
from rest_framework.generics import RetrieveAPIView

from apps.trips import models as trips_models
from apps.trips import serializers as trips_serializers


class TripDetail(RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = trips_serializers.ReadOnlyTripSerializer
    queryset = trips_models.Trip.objects.filter(status=trips_models.Trip.REQUESTED)
