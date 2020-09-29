import uuid

from django.contrib.auth import get_user_model
from django.db import models
from django.db.models import Q
from django.shortcuts import reverse
from django.utils.translation import gettext_lazy as _


class Trip(models.Model):
    """
    Model for storing Trip data.
    """

    REQUESTED = 'Requested'
    STARTED = 'Started'
    IN_PROGRESS = 'In Progress'
    COMPLETED = 'Completed'
    STATUSES = (
        (REQUESTED, REQUESTED),
        (STARTED, STARTED),
        (IN_PROGRESS, IN_PROGRESS),
        (COMPLETED, COMPLETED),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    pick_up_address = models.CharField(max_length=255)
    drop_off_address = models.CharField(max_length=255)
    status = models.CharField(max_length=16, choices=STATUSES, default=REQUESTED)
    driver = models.ForeignKey(
        get_user_model(), null=True, blank=True, on_delete=models.CASCADE, related_name='trips_as_driver'
    )
    rider = models.ForeignKey(
        get_user_model(), null=True, blank=True, on_delete=models.CASCADE, related_name='trips_as_rider'
    )

    def __str__(self):
        return f'{self.id}'

    def get_absolute_url(self):
        return reverse('trip:trip_detail', kwargs={'trip_id': self.id})

    class Meta:
        verbose_name = _('trip')
        verbose_name_plural = _('trips')
        constraints = [
            models.UniqueConstraint(
                fields=['driver'],
                condition=Q(status__in=['Requested', 'Started', 'In Progress']),
                name='unique_trip_per_driver',
            ),
            models.UniqueConstraint(
                fields=['rider'],
                condition=Q(status__in=['Requested', 'Started', 'In Progress']),
                name='unique_trip_per_rider',
            ),
        ]
