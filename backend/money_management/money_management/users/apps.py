import contextlib

from django.apps import AppConfig
from django.utils.translation import gettext_lazy as _


class UsersConfig(AppConfig):
    name = "money_management.users"
    verbose_name = _("Users")

    def ready(self):
        with contextlib.suppress(ImportError):
            import money_management.users.signals  # noqa: F401
