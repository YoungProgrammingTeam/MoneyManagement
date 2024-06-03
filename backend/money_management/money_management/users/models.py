
from typing import ClassVar

from django.contrib.auth.models import AbstractUser
from django.db import models
from django.db.models import CharField
from django.db.models import EmailField
from django.urls import reverse
from django.utils.translation import gettext_lazy as _
from django.conf import settings

from .managers import UserManager

class Expense(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    category = models.CharField(_("Category"), max_length=255)
    amount = models.DecimalField(_("Amount"), max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.category}: {self.amount}"

class Transaction(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    category = models.CharField(_("Category"), max_length=255)
    balance = models.DecimalField(_("Balance"), max_digits=10, decimal_places=2)
    amount = models.DecimalField(_("Amount"), max_digits=10, decimal_places=2)
    percentage = models.CharField(_("Percentage"), max_length=10)

    def __str__(self):
        return f"{self.category}: {self.amount} ({self.percentage})"

class ExpenseAnalytics(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    month = models.CharField(_("Month"), max_length=3)
    amount = models.DecimalField(_("Amount"), max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.month}: {self.amount}"

class User(AbstractUser):
    """
    Default custom user model for My Money Management project.
    If adding fields that need to be filled at user signup,
    check forms.SignupForm and forms.SocialSignupForms accordingly.
    """

    # First and last name do not cover name patterns around the globe
    name = CharField(_("Name of User"), blank=True, max_length=255)
    first_name = None  # type: ignore[assignment]
    last_name = None  # type: ignore[assignment]
    email = EmailField(_("email address"), unique=True)
    username = None  # type: ignore[assignment]

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    objects: ClassVar[UserManager] = UserManager()

    def get_absolute_url(self) -> str:
        """Get URL for user's detail view.

        Returns:
            str: URL for user detail.

        """
        return reverse("users:detail", kwargs={"pk": self.id})
