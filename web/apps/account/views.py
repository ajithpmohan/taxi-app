from rest_framework import permissions
from rest_framework.generics import CreateAPIView
from rest_framework.parsers import MultiPartParser
from rest_framework_simplejwt import views as jwt_views

from apps.account import serializers as account_serializers


class SignUpView(CreateAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = account_serializers.SignUpSerializer
    parser_classes = [MultiPartParser]


class TokenObtainPairView(jwt_views.TokenObtainPairView):
    serializer_class = account_serializers.TokenObtainPairSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({"request": self.request})
        return context
