"""
Models for donations app.
"""
from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from ckeditor.fields import RichTextField
from apps.core.models import TimeStampedModel


class DonationCampaign(TimeStampedModel):
    """
    Model for donation campaigns and fundraising goals.
    """
    name = models.CharField(max_length=200)
    description = RichTextField()
    goal_amount = models.DecimalField(max_digits=10, decimal_places=2)
    current_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    start_date = models.DateTimeField(default=timezone.now)
    end_date = models.DateTimeField(null=True, blank=True)
    image = models.ImageField(upload_to='campaigns/', blank=True, null=True)
    is_active = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=False)

    class Meta:
        ordering = ['-start_date']

    def __str__(self):
        return self.name

    @property
    def progress_percentage(self):
        if self.goal_amount > 0:
            return min((self.current_amount / self.goal_amount) * 100, 100)
        return 0

    @property
    def is_completed(self):
        return self.current_amount >= self.goal_amount


class Donation(TimeStampedModel):
    """
    Model for individual donations.
    """
    DONATION_TYPE_CHOICES = [
        ('tithe', 'Tithe'),
        ('offering', 'Offering'),
        ('building_fund', 'Building Fund'),
        ('missions', 'Missions'),
        ('special', 'Special Offering'),
        ('campaign', 'Campaign'),
        ('other', 'Other'),
    ]

    PAYMENT_STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
        ('cancelled', 'Cancelled'),
        ('refunded', 'Refunded'),
    ]

    PAYMENT_METHOD_CHOICES = [
        ('stripe', 'Credit/Debit Card'),
        ('paypal', 'PayPal'),
        ('bank_transfer', 'Bank Transfer'),
        ('cash', 'Cash'),
        ('check', 'Check'),
    ]

    # Donor information
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    donor_name = models.CharField(max_length=100, blank=True)
    donor_email = models.EmailField(blank=True)
    donor_phone = models.CharField(max_length=20, blank=True)

    # Donation details
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=3, default='USD')
    donation_type = models.CharField(max_length=20, choices=DONATION_TYPE_CHOICES, default='offering')
    campaign = models.ForeignKey(DonationCampaign, on_delete=models.SET_NULL, null=True, blank=True)
    message = models.TextField(blank=True, help_text="Optional message from donor")

    # Payment information
    payment_method = models.CharField(max_length=50, choices=PAYMENT_METHOD_CHOICES, default='stripe')
    transaction_id = models.CharField(max_length=100, unique=True, blank=True)
    status = models.CharField(max_length=20, choices=PAYMENT_STATUS_CHOICES, default='pending')
    stripe_payment_intent_id = models.CharField(max_length=100, blank=True)

    # Privacy settings
    is_anonymous = models.BooleanField(default=False)
    show_amount = models.BooleanField(default=True)

    # Processing details
    processed_at = models.DateTimeField(null=True, blank=True)
    receipt_sent = models.BooleanField(default=False)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        donor = self.donor_name or (self.user.get_full_name() if self.user else 'Anonymous')
        return f"${self.amount} - {donor} ({self.get_donation_type_display()})"

    @property
    def donor_display_name(self):
        if self.is_anonymous:
            return "Anonymous"
        return self.donor_name or (self.user.get_full_name() if self.user else "Anonymous")
