"""
Models for newsletter app.
"""
import uuid
from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from apps.core.models import TimeStampedModel


class NewsletterSubscriber(TimeStampedModel):
    """
    Enhanced model for newsletter subscribers.
    """
    email = models.EmailField(unique=True)
    name = models.CharField(max_length=100, blank=True)
    first_name = models.CharField(max_length=50, blank=True)
    last_name = models.CharField(max_length=50, blank=True)
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True, blank=True)

    # Subscription details
    is_active = models.BooleanField(default=True)
    is_confirmed = models.BooleanField(default=False)
    confirmation_token = models.UUIDField(default=uuid.uuid4, unique=True)
    confirmed_at = models.DateTimeField(null=True, blank=True)

    # Preferences
    frequency = models.CharField(
        max_length=20,
        choices=[
            ('weekly', 'Weekly'),
            ('monthly', 'Monthly'),
            ('special', 'Special Events Only'),
        ],
        default='weekly'
    )

    # Tracking
    subscribed_at = models.DateTimeField(auto_now_add=True)
    unsubscribed_at = models.DateTimeField(null=True, blank=True)
    unsubscribe_token = models.UUIDField(default=uuid.uuid4, unique=True)

    class Meta:
        ordering = ['-subscribed_at']

    def __str__(self):
        display_name = self.name or f"{self.first_name} {self.last_name}".strip()
        return f"{display_name} ({self.email})" if display_name else self.email

    @property
    def full_name(self):
        if self.name:
            return self.name
        return f"{self.first_name} {self.last_name}".strip()
