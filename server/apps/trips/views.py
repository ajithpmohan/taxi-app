from django.db.models import Q
from rest_framework import permissions
from rest_framework.generics import RetrieveAPIView

from apps.trips import models as trips_models
from apps.trips import serializers as trips_serializers


class TripDetail(RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = trips_serializers.ReadOnlyTripSerializer
    queryset = trips_models.Trip.objects.all()

    def filter_queryset(self, queryset):
        if self.request.user.get_role() == 'RIDER':
            return queryset.filter(rider=self.request.user).exclude(status=trips_models.Trip.REQUESTED)
        elif self.request.user.get_role() == 'DRIVER':
            return queryset.filter(
                Q(driver=self.request.user) | Q(status=trips_models.Trip.REQUESTED, driver=None)
            ).distinct()
        return queryset.none()
