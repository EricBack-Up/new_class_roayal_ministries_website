"""
Core models for New Class Royal Ministries website.
"""
from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from ckeditor.fields import RichTextField


class TimeStampedModel(models.Model):
    """
    Abstract base class that provides self-updating 'created' and 'modified' fields.
    """
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class ChurchInfo(TimeStampedModel):
    """
    Model to store church information and settings.
    """
    name = models.CharField(max_length=200, default="New Class Royal Ministries")
    tagline = models.CharField(max_length=300, blank=True)
    description = RichTextField(blank=True)
    
    # Contact Information
    phone = models.CharField(max_length=20, blank=True)
    email = models.EmailField(blank=True)
    address = models.TextField(blank=True)
    
    # Social Media
    facebook_url = models.URLField(blank=True)
    instagram_url = models.URLField(blank=True)
    youtube_url = models.URLField(blank=True)
    twitter_url = models.URLField(blank=True)
    
    # Service Times
    sunday_service_time = models.CharField(max_length=100, blank=True)
    wednesday_service_time = models.CharField(max_length=100, blank=True)
    
    # Images
    logo = models.ImageField(upload_to='church/logos/', blank=True, null=True)
    hero_image = models.ImageField(upload_to='church/hero/', blank=True, null=True)
    
    # Settings
    is_active = models.BooleanField(default=True)
    
    class Meta:
        verbose_name = "Church Information"
        verbose_name_plural = "Church Information"
    
    def __str__(self):
        return self.name


class Staff(TimeStampedModel):
    """
    Model for church staff and leadership.
    """
    POSITION_CHOICES = [
        ('pastor', 'Pastor'),
        ('associate_pastor', 'Associate Pastor'),
        ('elder', 'Elder'),
        ('deacon', 'Deacon'),
        ('worship_leader', 'Worship Leader'),
        ('youth_pastor', 'Youth Pastor'),
        ('children_pastor', 'Children Pastor'),
        ('administrator', 'Administrator'),
        ('other', 'Other'),
    ]
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True, blank=True)
    name = models.CharField(max_length=100)
    position = models.CharField(max_length=20, choices=POSITION_CHOICES)
    bio = RichTextField(blank=True)
    photo = models.ImageField(upload_to='staff/', blank=True, null=True)
    email = models.EmailField(blank=True)
    phone = models.CharField(max_length=20, blank=True)
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        ordering = ['order', 'name']
        verbose_name = "Staff Member"
        verbose_name_plural = "Staff Members"
    
    def __str__(self):
        return f"{self.name} - {self.get_position_display()}"


class Ministry(TimeStampedModel):
    """
    Model for church ministries and departments.
    """
    name = models.CharField(max_length=100)
    description = RichTextField()
    leader = models.ForeignKey(Staff, on_delete=models.SET_NULL, null=True, blank=True)
    image = models.ImageField(upload_to='ministries/', blank=True, null=True)
    contact_email = models.EmailField(blank=True)
    meeting_time = models.CharField(max_length=100, blank=True)
    meeting_location = models.CharField(max_length=200, blank=True)
    is_active = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)
    
    class Meta:
        ordering = ['order', 'name']
        verbose_name_plural = "Ministries"
    
    def __str__(self):
        return self.name


class Announcement(TimeStampedModel):
    """
    Model for church announcements.
    """
    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('normal', 'Normal'),
        ('high', 'High'),
        ('urgent', 'Urgent'),
    ]
    
    title = models.CharField(max_length=200)
    content = RichTextField()
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='normal')
    start_date = models.DateTimeField(default=timezone.now)
    end_date = models.DateTimeField()
    is_active = models.BooleanField(default=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    
    class Meta:
        ordering = ['-priority', '-start_date']
    
    def __str__(self):
        return self.title
    
    @property
    def is_current(self):
        now = timezone.now()
        return self.start_date <= now <= self.end_date and self.is_active


class VerseOfTheDay(TimeStampedModel):
    """
    Model for daily Bible verses.
    """
    verse_text = models.TextField()
    reference = models.CharField(max_length=100)  # e.g., "John 3:16"
    date = models.DateField(unique=True)
    image = models.ImageField(upload_to='verses/', blank=True, null=True)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        ordering = ['-date']
        verbose_name = "Verse of the Day"
        verbose_name_plural = "Verses of the Day"
    
    def __str__(self):
        return f"{self.reference} - {self.date}"


class ContactMessage(TimeStampedModel):
    """
    Model for contact form submissions.
    """
    name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=20, blank=True)
    subject = models.CharField(max_length=200)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    replied_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.name} - {self.subject}"
