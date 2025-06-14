"""
Serializers for donations app.
"""
from rest_framework import serializers
from .models import Donation, DonationCampaign


class DonationCampaignSerializer(serializers.ModelSerializer):
    """
    Serializer for donation campaigns.
    """
    progress_percentage = serializers.ReadOnlyField()
    is_completed = serializers.ReadOnlyField()
    
    class Meta:
        model = DonationCampaign
        fields = [
            'id', 'name', 'description', 'goal_amount', 'current_amount',
            'start_date', 'end_date', 'image', 'is_active', 'is_featured',
            'progress_percentage', 'is_completed', 'created_at'
        ]


class DonationSerializer(serializers.ModelSerializer):
    """
    Serializer for donations.
    """
    donor_display_name = serializers.ReadOnlyField()
    campaign = DonationCampaignSerializer(read_only=True)
    
    class Meta:
        model = Donation
        fields = [
            'id', 'donor_display_name', 'amount', 'currency', 'donation_type',
            'campaign', 'message', 'payment_method', 'status', 'is_anonymous',
            'show_amount', 'processed_at', 'created_at'
        ]


class DonationCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating donations.
    """
    class Meta:
        model = Donation
        fields = [
            'donor_name', 'donor_email', 'donor_phone', 'amount',
            'donation_type', 'campaign', 'message', 'payment_method',
            'is_anonymous', 'show_amount'
        ]
    
    def validate_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError("Donation amount must be greater than 0.")
        if value > 10000:  # Set a reasonable maximum
            raise serializers.ValidationError("Donation amount cannot exceed $10,000.")
        return value


class DonationHistorySerializer(serializers.ModelSerializer):
    """
    Simplified serializer for donation history.
    """
    campaign_name = serializers.CharField(source='campaign.name', read_only=True)
    
    class Meta:
        model = Donation
        fields = [
            'id', 'amount', 'currency', 'donation_type', 'campaign_name',
            'payment_method', 'status', 'created_at'
        ]
