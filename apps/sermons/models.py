"""
Models for sermons app.
"""
from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from ckeditor.fields import RichTextField
from taggit.managers import TaggableManager
from apps.core.models import TimeStampedModel, Staff


class SermonSeries(TimeStampedModel):
    """
    Model for sermon series.
    """
    title = models.CharField(max_length=200)
    description = RichTextField(blank=True)
    image = models.ImageField(upload_to='sermon_series/', blank=True, null=True)
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        ordering = ['-start_date']
        verbose_name_plural = "Sermon Series"
    
    def __str__(self):
        return self.title
    
    @property
    def sermon_count(self):
        return self.sermons.count()


class Sermon(TimeStampedModel):
    """
    Model for individual sermons.
    """
    title = models.CharField(max_length=200)
    description = RichTextField(blank=True)
    preacher = models.ForeignKey(Staff, on_delete=models.CASCADE, related_name='sermons')
    series = models.ForeignKey(SermonSeries, on_delete=models.SET_NULL, null=True, blank=True, related_name='sermons')
    
    # Scripture references
    scripture_reference = models.CharField(max_length=200, blank=True)
    
    # Media files
    audio_file = models.FileField(upload_to='sermons/audio/', blank=True, null=True)
    video_file = models.FileField(upload_to='sermons/video/', blank=True, null=True)
    video_url = models.URLField(blank=True, help_text="YouTube, Vimeo, or other video URL")
    
    # Additional resources
    sermon_notes = models.FileField(upload_to='sermons/notes/', blank=True, null=True)
    thumbnail = models.ImageField(upload_to='sermons/thumbnails/', blank=True, null=True)
    
    # Metadata
    date_preached = models.DateTimeField(default=timezone.now)
    duration_minutes = models.PositiveIntegerField(null=True, blank=True)
    view_count = models.PositiveIntegerField(default=0)
    download_count = models.PositiveIntegerField(default=0)
    
    # Publishing
    is_published = models.BooleanField(default=False)
    is_featured = models.BooleanField(default=False)
    
    # Tags for categorization
    tags = TaggableManager(blank=True)
    
    class Meta:
        ordering = ['-date_preached']
    
    def __str__(self):
        return f"{self.title} - {self.preacher.name}"
    
    def increment_view_count(self):
        self.view_count += 1
        self.save(update_fields=['view_count'])
    
    def increment_download_count(self):
        self.download_count += 1
        self.save(update_fields=['download_count'])


class SermonComment(TimeStampedModel):
    """
    Model for sermon comments and feedback.
    """
    sermon = models.ForeignKey(Sermon, on_delete=models.CASCADE, related_name='comments')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    comment = models.TextField()
    is_approved = models.BooleanField(default=False)
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='replies')
    
    class Meta:
        ordering = ['created_at']
    
    def __str__(self):
        return f"Comment by {self.user.get_full_name()} on {self.sermon.title}"


class SermonPlaylist(TimeStampedModel):
    """
    Model for sermon playlists.
    """
    name = models.CharField(max_length=200)
    description = RichTextField(blank=True)
    sermons = models.ManyToManyField(Sermon, through='PlaylistItem')
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    is_public = models.BooleanField(default=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return self.name


class PlaylistItem(TimeStampedModel):
    """
    Through model for playlist items with ordering.
    """
    playlist = models.ForeignKey(SermonPlaylist, on_delete=models.CASCADE)
    sermon = models.ForeignKey(Sermon, on_delete=models.CASCADE)
    order = models.PositiveIntegerField(default=0)
    
    class Meta:
        ordering = ['order']
        unique_together = ['playlist', 'sermon']


class SermonDownload(TimeStampedModel):
    """
    Model to track sermon downloads.
    """
    sermon = models.ForeignKey(Sermon, on_delete=models.CASCADE, related_name='downloads')
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    ip_address = models.GenericIPAddressField()
    file_type = models.CharField(max_length=10, choices=[('audio', 'Audio'), ('video', 'Video'), ('notes', 'Notes')])
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.sermon.title} - {self.file_type} download"
