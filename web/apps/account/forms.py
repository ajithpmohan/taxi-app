from django.contrib.auth import forms as auth_forms
from django.contrib.auth import get_user_model

User = get_user_model()


class UserCreationForm(auth_forms.UserCreationForm):

    class Meta:
        model = User
        fields = ('email',)


class UserChangeForm(auth_forms.UserChangeForm):

    class Meta:
        model = User
        fields = ('email',)
