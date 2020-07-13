from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from rest_framework import serializers
from rest_framework_simplejwt import serializers as jwt_serializers

from apps.account.validators import MaximumLengthValidator, MinimumLengthValidator


class SignUpSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[MinimumLengthValidator(), MaximumLengthValidator()])
    confirm_password = serializers.CharField(write_only=True)
    groups = serializers.CharField()

    class Meta:
        model = get_user_model()
        fields = ('id', 'email', 'password', 'confirm_password', 'first_name', 'last_name', 'avatar', 'groups')

    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError('Passwords must match.')
        return data

    def validate_groups(self, value):
        if not Group.objects.filter(name=value).exists():
            raise serializers.ValidationError('Group must be either DRIVER or RIDER')
        return value

    def create(self, validated_data):
        validated_data.pop('confirm_password')
        group = Group.objects.filter(name=validated_data.pop('groups'))
        user = self.Meta.model.objects.create_user(**validated_data)
        user.groups.add(*group)
        user.save()
        return user

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['groups'] = instance.get_type()
        return representation


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
