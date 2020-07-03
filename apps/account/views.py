from rest_framework_simplejwt import views as jwt_views

from apps.account import serializers as account_serializers


class TokenObtainPairView(jwt_views.TokenObtainPairView):
    serializer_class = account_serializers.TokenObtainPairSerializer
