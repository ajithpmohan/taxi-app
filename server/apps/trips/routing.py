from django.urls import re_path

from apps.trips import consumers

websocket_urlpatterns = [
    re_path(r'ws/trip/$', consumers.TaxiConsumer.as_asgi()),
]
