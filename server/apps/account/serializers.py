from collections import OrderedDict

from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from django.utils.translation import ugettext as _
from rest_framework import serializers
from rest_framework_simplejwt import serializers as jwt_serializers

from apps.account import validators


class SignUpSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[
        validators.MinimumLengthValidator(), validators.MaximumLengthValidator()])
    password2 = serializers.CharField(write_only=True)
    groups = serializers.CharField()

    class Meta:
        model = get_user_model()
        fields = ('email', 'password', 'password2', 'first_name', 'last_name', 'avatar', 'groups')

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError({'password': _('Passwords must match.')})
        return data

    def validate_groups(self, value):
        if not Group.objects.filter(name=value).exists():
            raise serializers.ValidationError(_('This field must be either DRIVER or RIDER'))
        return value

    def create(self, validated_data):
        validated_data.pop('password2')
        group = Group.objects.filter(name=validated_data.pop('groups'))
        user = self.Meta.model.objects.create_user(**validated_data)
        user.groups.add(*group)
        user.save()
        return user

    def to_representation(self, instance):
        representation = OrderedDict()
        representation['message'] = f'Account activation email sent to {instance.email}'
        return representation


class UserSerializer(serializers.ModelSerializer):
    avatar = serializers.SerializerMethodField('get_avatar_url')
    fullname = serializers.CharField(source='get_full_name')
    role = serializers.CharField(source='get_role')

    class Meta:
        model = get_user_model()
        fields = ('email', 'fullname', 'avatar', 'role')

    def get_avatar_url(self, obj):
        if bool(obj.avatar):
            return self.context['request'].build_absolute_uri(obj.avatar.url)


class ReadOnlyUserSerializer(serializers.ModelSerializer):
    fullname = serializers.CharField(source='get_full_name')

    class Meta:
        model = get_user_model()
        fields = ('email', 'fullname')


class TokenObtainPairSerializer(jwt_serializers.TokenObtainPairSerializer):

    def validate(self, attrs):
        data = super().validate(attrs)
        data['user'] = UserSerializer(self.user, context=self.context).data
        return data
