"""
Models for members app.
"""
from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from apps.core.models import TimeStampedModel


class MemberProfile(TimeStampedModel):
    """
    Extended profile for church members.
    """
    MEMBERSHIP_STATUS_CHOICES = [
        ('visitor', 'Visitor'),
        ('regular_attendee', 'Regular Attendee'),
        ('member', 'Member'),
        ('inactive', 'Inactive'),
    ]
    
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    phone = models.CharField(max_length=20, blank=True)
    address = models.TextField(blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    profile_picture = models.ImageField(upload_to='members/profiles/', blank=True, null=True)
    
    # Membership details
    membership_status = models.CharField(max_length=20, choices=MEMBERSHIP_STATUS_CHOICES, default='visitor')
    date_joined_church = models.DateField(null=True, blank=True)
    baptism_date = models.DateField(null=True, blank=True)
    
    # Emergency contact
    emergency_contact_name = models.CharField(max_length=100, blank=True)
    emergency_contact_phone = models.CharField(max_length=20, blank=True)
    emergency_contact_relationship = models.CharField(max_length=50, blank=True)
    
    # Preferences
    receive_newsletters = models.BooleanField(default=True)
    receive_event_notifications = models.BooleanField(default=True)
    receive_prayer_notifications = models.BooleanField(default=True)
    
    # Privacy
    profile_visibility = models.CharField(
        max_length=20,
        choices=[
            ('public', 'Public'),
            ('members_only', 'Members Only'),
            ('private', 'Private'),
        ],
        default='members_only'
    )
    
    class Meta:
        ordering = ['user__last_name', 'user__first_name']
    
    def __str__(self):
        return f"{self.user.get_full_name()} ({self.get_membership_status_display()})"
    
    @property
    def full_name(self):
        return self.user.get_full_name() or self.user.username
    
    @property
    def age(self):
        if self.date_of_birth:
            today = timezone.now().date()
            return today.year - self.date_of_birth.year - (
                (today.month, today.day) < (self.date_of_birth.month, self.date_of_birth.day)
            )
        return None


class MemberMinistry(TimeStampedModel):
    """
    Model to track member involvement in ministries.
    """
    ROLE_CHOICES = [
        ('member', 'Member'),
        ('volunteer', 'Volunteer'),
        ('leader', 'Leader'),
        ('coordinator', 'Coordinator'),
    ]
    
    member = models.ForeignKey(MemberProfile, on_delete=models.CASCADE, related_name='ministry_involvements')
    ministry = models.ForeignKey('core.Ministry', on_delete=models.CASCADE, related_name='member_involvements')
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='member')
    start_date = models.DateField(default=timezone.now)
    end_date = models.DateField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        unique_together = ['member', 'ministry']
        ordering = ['-start_date']
    
    def __str__(self):
        return f"{self.member.full_name} - {self.ministry.name} ({self.get_role_display()})"
