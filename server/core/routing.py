from channels.routing import ProtocolTypeRouter, URLRouter

from apps.account.authentication import TokenAuthMiddlewareStack
from apps.trips import routing as trips_routing

application = ProtocolTypeRouter(
    {
        'websocket': TokenAuthMiddlewareStack(URLRouter(trips_routing.websocket_urlpatterns)),
    }
)
