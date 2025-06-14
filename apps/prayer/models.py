"""
Models for prayer app.
"""
from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from apps.core.models import TimeStampedModel


class PrayerCategory(TimeStampedModel):
    """
    Model for prayer request categories.
    """
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    color = models.CharField(max_length=7, default='#3B82F6', help_text="Hex color code")
    is_active = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order', 'name']
        verbose_name_plural = "Prayer Categories"

    def __str__(self):
        return self.name


class PrayerRequest(TimeStampedModel):
    """
    Enhanced model for prayer requests.
    """
    URGENCY_CHOICES = [
        ('low', 'Low'),
        ('normal', 'Normal'),
        ('high', 'High'),
        ('urgent', 'Urgent'),
    ]

    STATUS_CHOICES = [
        ('active', 'Active'),
        ('answered', 'Answered'),
        ('closed', 'Closed'),
    ]

    # Requester information
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    name = models.CharField(max_length=100)
    email = models.EmailField(blank=True)

    # Prayer request details
    title = models.CharField(max_length=200, default='Prayer Request')
    request_text = models.TextField()
    category = models.ForeignKey(PrayerCategory, on_delete=models.SET_NULL, null=True, blank=True)
    urgency = models.CharField(max_length=10, choices=URGENCY_CHOICES, default='normal')
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='active')

    # Privacy and moderation
    is_public = models.BooleanField(default=False)
    is_answered = models.BooleanField(default=False)
    is_anonymous = models.BooleanField(default=False)
    is_approved = models.BooleanField(default=True)

    # Tracking
    prayer_count = models.PositiveIntegerField(default=0)
    answer_description = models.TextField(blank=True, help_text="How was this prayer answered?")
    answered_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-urgency', '-created_at']

    def __str__(self):
        return f"Prayer request by {self.name}: {self.title}"

    @property
    def requester_display_name(self):
        if self.is_anonymous:
            return "Anonymous"
        return self.name


class Prayer(TimeStampedModel):
    """
    Model for tracking who prayed for each request.
    """
    prayer_request = models.ForeignKey(PrayerRequest, on_delete=models.CASCADE, related_name='prayers')
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    prayed_by_name = models.CharField(max_length=100, blank=True)
    message = models.TextField(blank=True, help_text="Optional encouragement message")
    is_anonymous = models.BooleanField(default=False)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        prayed_by = self.prayed_by_name or (self.user.get_full_name() if self.user else 'Anonymous')
        return f"Prayer by {prayed_by} for {self.prayer_request.title}"
