"""
Serializers for events app.
"""
from rest_framework import serializers
from .models import Event, EventCategory, EventRegistration, EventAttendance
from apps.core.serializers import MinistrySerializer


class EventCategorySerializer(serializers.ModelSerializer):
    """
    Serializer for event categories.
    """
    class Meta:
        model = EventCategory
        fields = ['id', 'name', 'description', 'color', 'is_active']


class EventSerializer(serializers.ModelSerializer):
    """
    Serializer for events.
    """
    category = EventCategorySerializer(read_only=True)
    ministry = MinistrySerializer(read_only=True)
    registration_count = serializers.ReadOnlyField()
    is_registration_open = serializers.ReadOnlyField()
    is_upcoming = serializers.ReadOnlyField()
    is_ongoing = serializers.ReadOnlyField()
    is_past = serializers.ReadOnlyField()
    
    class Meta:
        model = Event
        fields = [
            'id', 'title', 'description', 'category', 'ministry',
            'start_datetime', 'end_datetime', 'all_day', 'location',
            'address', 'online_link', 'image', 'requires_registration',
            'max_attendees', 'registration_deadline', 'registration_fee',
            'is_published', 'is_featured', 'contact_person',
            'contact_email', 'contact_phone', 'registration_count',
            'is_registration_open', 'is_upcoming', 'is_ongoing', 'is_past',
            'created_at', 'updated_at'
        ]


class EventListSerializer(serializers.ModelSerializer):
    """
    Simplified serializer for event lists.
    """
    category = EventCategorySerializer(read_only=True)
    registration_count = serializers.ReadOnlyField()
    is_registration_open = serializers.ReadOnlyField()
    
    class Meta:
        model = Event
        fields = [
            'id', 'title', 'description', 'category', 'start_datetime',
            'end_datetime', 'all_day', 'location', 'image',
            'requires_registration', 'registration_count',
            'is_registration_open', 'is_featured'
        ]


class EventRegistrationSerializer(serializers.ModelSerializer):
    """
    Serializer for event registrations.
    """
    full_name = serializers.ReadOnlyField()
    
    class Meta:
        model = EventRegistration
        fields = [
            'id', 'event', 'first_name', 'last_name', 'email',
            'phone', 'number_of_attendees', 'special_requirements',
            'is_confirmed', 'payment_status', 'full_name', 'created_at'
        ]
        read_only_fields = ['is_confirmed', 'payment_status']


class EventRegistrationCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating event registrations.
    """
    class Meta:
        model = EventRegistration
        fields = [
            'first_name', 'last_name', 'email', 'phone',
            'number_of_attendees', 'special_requirements'
        ]
    
    def validate_email(self, value):
        event_id = self.context['view'].kwargs.get('pk')
        if EventRegistration.objects.filter(event_id=event_id, email=value).exists():
            raise serializers.ValidationError("You have already registered for this event.")
        return value


class EventAttendanceSerializer(serializers.ModelSerializer):
    """
    Serializer for event attendance.
    """
    class Meta:
        model = EventAttendance
        fields = [
            'id', 'event', 'name', 'email', 'phone',
            'check_in_time', 'check_out_time'
        ]
