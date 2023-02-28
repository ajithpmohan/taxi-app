from django.contrib import admin

from apps.trips.models import Trip


@admin.register(Trip)
class TripAdmin(admin.ModelAdmin):
    """
    Admin Panel for handling Trip Model
    """

    fields = (
        'id',
        'pick_up_address',
        'drop_off_address',
        'status',
        'rider',
        'driver',
        'created',
        'updated',
    )
    list_display = (
        'id',
        'pick_up_address',
        'drop_off_address',
        'status',
        'rider',
        'driver',
        'created',
        'updated',
    )
    list_filter = ('status',)
    readonly_fields = (
        'id',
        'created',
        'updated',
    )
