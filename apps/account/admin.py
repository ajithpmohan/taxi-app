from django.contrib import admin
from django.contrib.auth import get_user_model
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from apps.account import forms as account_forms

User = get_user_model()


class UserAdmin(BaseUserAdmin):
    add_form = account_forms.UserCreationForm
    form = account_forms.UserChangeForm
    model = User
    list_display = ('email', 'is_staff', 'is_superuser', 'is_active', 'date_joined', 'last_login',)
    list_filter = ('email', 'is_staff', 'is_superuser', 'is_active',)
    fieldsets = (
        (None, {'fields': ('email', 'password', 'first_name', 'last_name', 'avatar')}),
        ('Permissions', {'fields': ('is_staff', 'is_active')}),
        ('Groups', {'fields': ('groups',)}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2', 'is_staff', 'is_active')
        }),
    )
    search_fields = ('email',)
    ordering = ('email',)


admin.site.register(User, UserAdmin)
