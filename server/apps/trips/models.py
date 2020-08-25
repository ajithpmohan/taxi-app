import uuid

from django.contrib.auth import get_user_model
from django.db import models
from django.shortcuts import reverse
from django_fsm import FSMField, transition


class Trip(models.Model):
    REQUESTED = 'REQUESTED'
    STARTED = 'STARTED'
    IN_PROGRESS = 'IN_PROGRESS'
    COMPLETED = 'COMPLETED'
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
    status = FSMField(max_length=20, choices=STATUSES, default=REQUESTED)
    driver = models.ForeignKey(
        get_user_model(),
        null=True,
        blank=True,
        on_delete=models.CASCADE,
        related_name='trips_as_driver'
    )
    rider = models.ForeignKey(
        get_user_model(),
        null=True,
        blank=True,
        on_delete=models.CASCADE,
        related_name='trips_as_rider'
    )

    def __str__(self):
        return f'{self.id}'

    def get_absolute_url(self):
        return reverse('trip:trip_detail', kwargs={'trip_id': self.id})

    @transition(field=status, source=REQUESTED, target=STARTED)
    def start(self):
        pass

    @transition(field=status, source=STARTED, target=IN_PROGRESS)
    def progress(self):
        pass

    @transition(field=status, source=IN_PROGRESS, target=COMPLETED)
    def complete(self):
        pass
