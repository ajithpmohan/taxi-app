from django.contrib.auth import get_user_model
from rest_framework import serializers
from rest_framework_simplejwt import serializers as jwt_serializers


class UserSerializer(serializers.ModelSerializer):
    fullname = serializers.SerializerMethodField()
    type = serializers.SerializerMethodField('get_user_type')
    avatar = serializers.SerializerMethodField('get_avatar_url')

    class Meta:
        model = get_user_model()
        fields = ('email', 'fullname', 'avatar', 'type')

    def get_fullname(self, obj):
        return obj.get_full_name()

    def get_user_type(self, obj):
        return obj.get_type()

    def get_avatar_url(self, obj):
        if bool(obj.avatar):
            return self.context['request'].build_absolute_uri(obj.avatar.url)


class TokenObtainPairSerializer(jwt_serializers.TokenObtainPairSerializer):

    def validate(self, attrs):
        data = super().validate(attrs)
        data['user'] = UserSerializer(self.user, context=self.context).data
        return data
