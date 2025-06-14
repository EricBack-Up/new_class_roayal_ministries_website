"""
Models for events app.
"""
from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from ckeditor.fields import RichTextField
from apps.core.models import TimeStampedModel, Ministry


class EventCategory(TimeStampedModel):
    """
    Model for event categories.
    """
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    color = models.CharField(max_length=7, default='#3B82F6', help_text="Hex color code")
    is_active = models.BooleanField(default=True)
    
    class Meta:
        verbose_name_plural = "Event Categories"
        ordering = ['name']
    
    def __str__(self):
        return self.name


class Event(TimeStampedModel):
    """
    Model for church events.
    """
    RECURRENCE_CHOICES = [
        ('none', 'No Recurrence'),
        ('daily', 'Daily'),
        ('weekly', 'Weekly'),
        ('monthly', 'Monthly'),
        ('yearly', 'Yearly'),
    ]
    
    title = models.CharField(max_length=200)
    description = RichTextField()
    category = models.ForeignKey(EventCategory, on_delete=models.CASCADE, related_name='events')
    ministry = models.ForeignKey(Ministry, on_delete=models.SET_NULL, null=True, blank=True)
    
    # Date and time
    start_datetime = models.DateTimeField()
    end_datetime = models.DateTimeField()
    all_day = models.BooleanField(default=False)
    
    # Location
    location = models.CharField(max_length=200, blank=True)
    address = models.TextField(blank=True)
    online_link = models.URLField(blank=True, help_text="Zoom, YouTube, or other online meeting link")
    
    # Media
    image = models.ImageField(upload_to='events/', blank=True, null=True)
    
    # Registration
    requires_registration = models.BooleanField(default=False)
    max_attendees = models.PositiveIntegerField(null=True, blank=True)
    registration_deadline = models.DateTimeField(null=True, blank=True)
    registration_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    
    # Recurrence
    recurrence = models.CharField(max_length=10, choices=RECURRENCE_CHOICES, default='none')
    recurrence_end_date = models.DateField(null=True, blank=True)
    
    # Publishing
    is_published = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=False)
    
    # Contact
    contact_person = models.CharField(max_length=100, blank=True)
    contact_email = models.EmailField(blank=True)
    contact_phone = models.CharField(max_length=20, blank=True)
    
    class Meta:
        ordering = ['start_datetime']
    
    def __str__(self):
        return f"{self.title} - {self.start_datetime.strftime('%Y-%m-%d %H:%M')}"
    
    @property
    def is_upcoming(self):
        return self.start_datetime > timezone.now()
    
    @property
    def is_ongoing(self):
        now = timezone.now()
        return self.start_datetime <= now <= self.end_datetime
    
    @property
    def is_past(self):
        return self.end_datetime < timezone.now()
    
    @property
    def registration_count(self):
        return self.registrations.filter(is_confirmed=True).count()
    
    @property
    def is_registration_open(self):
        if not self.requires_registration:
            return False
        
        now = timezone.now()
        if self.registration_deadline and now > self.registration_deadline:
            return False
        
        if self.max_attendees and self.registration_count >= self.max_attendees:
            return False
        
        return self.is_upcoming


class EventRegistration(TimeStampedModel):
    """
    Model for event registrations.
    """
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='registrations')
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    
    # Guest registration (for non-users)
    first_name = models.CharField(max_length=50, blank=True)
    last_name = models.CharField(max_length=50, blank=True)
    email = models.EmailField()
    phone = models.CharField(max_length=20, blank=True)
    
    # Registration details
    number_of_attendees = models.PositiveIntegerField(default=1)
    special_requirements = models.TextField(blank=True)
    
    # Status
    is_confirmed = models.BooleanField(default=True)
    attended = models.BooleanField(default=False)
    
    # Payment (if required)
    payment_status = models.CharField(
        max_length=20,
        choices=[
            ('pending', 'Pending'),
            ('paid', 'Paid'),
            ('failed', 'Failed'),
            ('refunded', 'Refunded'),
        ],
        default='pending'
    )
    payment_reference = models.CharField(max_length=100, blank=True)
    
    class Meta:
        unique_together = ['event', 'email']
        ordering = ['-created_at']
    
    def __str__(self):
        name = f"{self.first_name} {self.last_name}".strip()
        if not name and self.user:
            name = self.user.get_full_name() or self.user.username
        return f"{name} - {self.event.title}"
    
    @property
    def full_name(self):
        if self.user:
            return self.user.get_full_name() or self.user.username
        return f"{self.first_name} {self.last_name}".strip()


class EventAttendance(TimeStampedModel):
    """
    Model for tracking event attendance via QR codes.
    """
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='attendances')
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    registration = models.ForeignKey(EventRegistration, on_delete=models.SET_NULL, null=True, blank=True)
    
    # For walk-in attendees
    name = models.CharField(max_length=100, blank=True)
    email = models.EmailField(blank=True)
    phone = models.CharField(max_length=20, blank=True)
    
    # Attendance details
    check_in_time = models.DateTimeField(auto_now_add=True)
    check_out_time = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        ordering = ['-check_in_time']
    
    def __str__(self):
        name = self.name
        if not name and self.user:
            name = self.user.get_full_name() or self.user.username
        elif not name and self.registration:
            name = self.registration.full_name
        return f"{name} - {self.event.title}"


class EventReminder(TimeStampedModel):
    """
    Model for event reminders.
    """
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='reminders')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    reminder_datetime = models.DateTimeField()
    is_sent = models.BooleanField(default=False)
    
    class Meta:
        unique_together = ['event', 'user']
        ordering = ['reminder_datetime']
    
    def __str__(self):
        return f"Reminder for {self.user.username} - {self.event.title}"
