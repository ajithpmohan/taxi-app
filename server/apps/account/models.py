from __future__ import unicode_literals

from django.contrib.auth.base_user import AbstractBaseUser
from django.contrib.auth.models import Group, PermissionsMixin
from django.core.mail import send_mail
from django.db import models
from django.utils.translation import gettext_lazy as _

from apps.account import managers
from apps.utils import helpers


class User(AbstractBaseUser, PermissionsMixin):
    """
    User Model extended from django built-in AbstractBaseUser & PermissionsMixin.
    """

    email = models.EmailField(_('email address'), unique=True)
    first_name = models.CharField(_('first name'), max_length=150, blank=True)
    last_name = models.CharField(_('last name'), max_length=150, blank=True)
    avatar = models.ImageField(
        _('Avatar'), upload_to=helpers.default_avatar_path, blank=True, null=True
    )
    is_staff = models.BooleanField(
        _('staff status'),
        default=False,
        help_text=_('Designates whether the user can log into this admin site.'),
    )
    is_active = models.BooleanField(
        _('active'),
        default=True,
        help_text=_(
            'Designates whether this user should be treated as active. \
            Unselect this instead of deleting accounts.'
        ),
    )
    date_joined = models.DateTimeField(_('date joined'), auto_now_add=True)

    objects = managers.UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    class Meta:
        verbose_name = _('user')
        verbose_name_plural = _('users')

    def get_full_name(self):
        """
        Returns the first_name plus the last_name, with a space in between.
        """
        full_name = f'{self.first_name} {self.last_name}'
        return full_name.strip()

    def get_email(self):
        """
        Returns the email id for the user.
        """
        return self.email

    def email_user(self, subject, message, from_email=None, **kwargs):
        """
        Sends an email to this User.
        """
        send_mail(subject, message, from_email, [self.email], **kwargs)

    @property
    def is_rider(self):
        """
        Return True if current user has rider role
        """
        rider = Group.objects.get(name='RIDER')  # WIP
        return rider in self.groups.all()

    @property
    def is_driver(self):
        """
        Return True if current user has driver role
        """
        driver = Group.objects.get(name='DRIVER')  # WIP
        return driver in self.groups.all()

    def get_role(self):
        """
        Return User Role.
        If user has no role RETURN None
        """
        if self.is_superuser | self.is_staff:
            return _('ADMIN')
        if self.is_rider:
            return _('RIDER')
        if self.is_driver:
            return _('DRIVER')
