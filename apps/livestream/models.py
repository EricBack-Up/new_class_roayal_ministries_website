"""
Models for livestream app.
"""
from django.db import models
from django.utils import timezone
from apps.core.models import TimeStampedModel


class LiveStream(TimeStampedModel):
    """
    Model for managing live streams.
    """
    STREAM_STATUS_CHOICES = [
        ('scheduled', 'Scheduled'),
        ('live', 'Live'),
        ('ended', 'Ended'),
        ('cancelled', 'Cancelled'),
    ]
    
    STREAM_TYPE_CHOICES = [
        ('service', 'Church Service'),
        ('conference', 'Conference'),
        ('training', 'Training Session'),
        ('workshop', 'Workshop'),
        ('special', 'Special Event'),
        ('other', 'Other'),
    ]
    
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    stream_type = models.CharField(max_length=20, choices=STREAM_TYPE_CHOICES, default='service')
    
    # Stream details
    youtube_url = models.URLField(blank=True, help_text="YouTube live stream URL")
    facebook_url = models.URLField(blank=True, help_text="Facebook live stream URL")
    zoom_url = models.URLField(blank=True, help_text="Zoom meeting URL")
    other_platform_url = models.URLField(blank=True, help_text="Other platform URL")
    
    # Schedule
    scheduled_start = models.DateTimeField()
    scheduled_end = models.DateTimeField(null=True, blank=True)
    actual_start = models.DateTimeField(null=True, blank=True)
    actual_end = models.DateTimeField(null=True, blank=True)
    
    # Status and settings
    status = models.CharField(max_length=20, choices=STREAM_STATUS_CHOICES, default='scheduled')
    is_featured = models.BooleanField(default=False)
    is_public = models.BooleanField(default=True)
    
    # Engagement
    viewer_count = models.PositiveIntegerField(default=0)
    max_viewers = models.PositiveIntegerField(default=0)
    
    # Thumbnail and media
    thumbnail = models.ImageField(upload_to='livestreams/', blank=True, null=True)
    
    class Meta:
        ordering = ['-scheduled_start']
    
    def __str__(self):
        return f"{self.title} - {self.scheduled_start.strftime('%Y-%m-%d %H:%M')}"
    
    @property
    def is_live(self):
        return self.status == 'live'
    
    @property
    def is_upcoming(self):
        return self.status == 'scheduled' and self.scheduled_start > timezone.now()
    
    @property
    def primary_stream_url(self):
        """Return the primary streaming URL"""
        if self.youtube_url:
            return self.youtube_url
        elif self.facebook_url:
            return self.facebook_url
        elif self.zoom_url:
            return self.zoom_url
        return self.other_platform_url


class StreamViewer(TimeStampedModel):
    """
    Model to track stream viewers.
    """
    stream = models.ForeignKey(LiveStream, on_delete=models.CASCADE, related_name='viewers')
    ip_address = models.GenericIPAddressField()
    user_agent = models.TextField(blank=True)
    joined_at = models.DateTimeField(auto_now_add=True)
    left_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        ordering = ['-joined_at']
    
    def __str__(self):
        return f"Viewer for {self.stream.title} - {self.joined_at}"


class StreamComment(TimeStampedModel):
    """
    Model for live stream comments and chat.
    """
    stream = models.ForeignKey(LiveStream, on_delete=models.CASCADE, related_name='comments')
    name = models.CharField(max_length=100)
    email = models.EmailField(blank=True)
    comment = models.TextField()
    is_approved = models.BooleanField(default=True)
    is_highlighted = models.BooleanField(default=False)  # For highlighting important comments
    
    class Meta:
        ordering = ['created_at']
    
    def __str__(self):
        return f"Comment by {self.name} on {self.stream.title}"