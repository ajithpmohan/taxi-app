from rest_framework_simplejwt import views as jwt_views

from apps.account import serializers as account_serializers


class TokenObtainPairView(jwt_views.TokenObtainPairView):
    serializer_class = account_serializers.TokenObtainPairSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({"request": self.request})
        return context
