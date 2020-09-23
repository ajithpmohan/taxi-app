from urllib.parse import parse_qs

from channels.auth import AuthMiddlewareStack
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from django.contrib.auth.models import AnonymousUser
from django.db import close_old_connections
from rest_framework_simplejwt.tokens import AccessToken

User = get_user_model()


class TokenAuthMiddleware:
    """
    Try to authenticate the given credentials. If authentication is
    successful, add the user into scope. If not, add the AnonymousUser
    into scope.
    """

    def __init__(self, inner):
        self.inner = inner

    def __call__(self, scope):
        return TokenAuthMiddlewareInstance(scope, self)


class TokenAuthMiddlewareInstance:
    def __init__(self, scope, middleware):
        self.middleware = middleware
        self.scope = dict(scope)
        self.inner = self.middleware.inner

    async def __call__(self, receive, send):
        await database_sync_to_async(close_old_connections)()

        query_string = parse_qs(self.scope['query_string'].decode())
        token = query_string.get('token')

        if not token:
            self.scope['user'] = await self.get_anonymous_user()
        try:
            access_token = AccessToken(token[0])
            user = await database_sync_to_async(User.objects.get)(id=access_token['id'])
        except Exception:
            user = await self.get_anonymous_user()
        if not user.is_active:
            user = await self.get_anonymous_user()

        self.scope['user'] = user
        inner = self.inner(self.scope)
        return await inner(receive, send)

    @database_sync_to_async
    def get_anonymous_user(self):
        return AnonymousUser()


def TokenAuthMiddlewareStack(inner):
    return TokenAuthMiddleware(AuthMiddlewareStack(inner))
