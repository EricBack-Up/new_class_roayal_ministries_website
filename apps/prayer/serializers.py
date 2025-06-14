"""
Serializers for prayer app.
"""
from rest_framework import serializers
from .models import PrayerRequest, Prayer, PrayerCategory


class PrayerCategorySerializer(serializers.ModelSerializer):
    """
    Serializer for prayer categories.
    """
    class Meta:
        model = PrayerCategory
        fields = ['id', 'name', 'description', 'color', 'is_active', 'order']


class PrayerSerializer(serializers.ModelSerializer):
    """
    Serializer for individual prayers.
    """
    prayed_by_display_name = serializers.ReadOnlyField()
    
    class Meta:
        model = Prayer
        fields = [
            'id', 'prayed_by_display_name', 'message', 'is_anonymous', 'created_at'
        ]


class PrayerRequestSerializer(serializers.ModelSerializer):
    """
    Serializer for prayer requests.
    """
    requester_display_name = serializers.ReadOnlyField()
    category = PrayerCategorySerializer(read_only=True)
    prayers = PrayerSerializer(many=True, read_only=True)
    
    class Meta:
        model = PrayerRequest
        fields = [
            'id', 'requester_display_name', 'title', 'request_text', 'category',
            'urgency', 'status', 'is_public', 'is_answered', 'is_anonymous',
            'prayer_count', 'answer_description', 'answered_at', 'prayers',
            'created_at', 'updated_at'
        ]


class PrayerRequestListSerializer(serializers.ModelSerializer):
    """
    Simplified serializer for prayer request lists.
    """
    requester_display_name = serializers.ReadOnlyField()
    category = PrayerCategorySerializer(read_only=True)
    
    class Meta:
        model = PrayerRequest
        fields = [
            'id', 'requester_display_name', 'title', 'request_text', 'category',
            'urgency', 'status', 'is_answered', 'prayer_count', 'created_at'
        ]


class PrayerRequestCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating prayer requests.
    """
    class Meta:
        model = PrayerRequest
        fields = [
            'name', 'email', 'title', 'request_text', 'category',
            'urgency', 'is_public', 'is_anonymous'
        ]
    
    def validate_request_text(self, value):
        if len(value.strip()) < 10:
            raise serializers.ValidationError("Prayer request must be at least 10 characters long.")
        return value


class PrayForRequestSerializer(serializers.ModelSerializer):
    """
    Serializer for praying for a request.
    """
    class Meta:
        model = Prayer
        fields = ['prayed_by_name', 'message', 'is_anonymous']
    
    def create(self, validated_data):
        # Get the prayer request from the view context
        prayer_request = self.context['prayer_request']
        user = self.context['request'].user if self.context['request'].user.is_authenticated else None
        
        # Create the prayer
        prayer = Prayer.objects.create(
            prayer_request=prayer_request,
            user=user,
            **validated_data
        )
        
        # Update prayer count
        prayer_request.prayer_count += 1
        prayer_request.save(update_fields=['prayer_count'])
        
        return prayer
