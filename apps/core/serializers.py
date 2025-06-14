"""
Serializers for core app.
"""
from rest_framework import serializers
from .models import ChurchInfo, Staff, Ministry, Announcement, VerseOfTheDay, ContactMessage, Program


class ChurchInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChurchInfo
        fields = '__all__'


class StaffSerializer(serializers.ModelSerializer):
    position_display = serializers.CharField(source='get_position_display', read_only=True)
    
    class Meta:
        model = Staff
        fields = [
            'id', 'name', 'position', 'position_display', 'bio', 
            'photo', 'email', 'phone', 'qualifications', 'specializations',
            'order', 'is_active'
        ]


class MinistrySerializer(serializers.ModelSerializer):
    leader_name = serializers.CharField(source='leader.name', read_only=True)
    ministry_type_display = serializers.CharField(source='get_ministry_type_display', read_only=True)
    
    class Meta:
        model = Ministry
        fields = [
            'id', 'name', 'description', 'ministry_type', 'ministry_type_display',
            'leader', 'leader_name', 'image', 'contact_email', 'meeting_time', 
            'meeting_location', 'is_active', 'order'
        ]


class AnnouncementSerializer(serializers.ModelSerializer):
    priority_display = serializers.CharField(source='get_priority_display', read_only=True)
    is_current = serializers.BooleanField(read_only=True)
    created_by_name = serializers.CharField(source='created_by.get_full_name', read_only=True)
    
    class Meta:
        model = Announcement
        fields = [
            'id', 'title', 'content', 'priority', 'priority_display',
            'start_date', 'end_date', 'is_active', 'is_current',
            'created_by', 'created_by_name', 'created_at'
        ]
        read_only_fields = ['created_by']


class VerseOfTheDaySerializer(serializers.ModelSerializer):
    class Meta:
        model = VerseOfTheDay
        fields = '__all__'


class ContactMessageSerializer(serializers.ModelSerializer):
    message_type_display = serializers.CharField(source='get_message_type_display', read_only=True)
    
    class Meta:
        model = ContactMessage
        fields = [
            'id', 'name', 'email', 'phone', 'subject', 'message',
            'message_type', 'message_type_display', 'is_read', 
            'replied_at', 'created_at'
        ]
        read_only_fields = ['is_read', 'replied_at']


class ContactMessageCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = ['name', 'email', 'phone', 'subject', 'message', 'message_type']


class ProgramSerializer(serializers.ModelSerializer):
    program_type_display = serializers.CharField(source='get_program_type_display', read_only=True)
    coordinator_name = serializers.CharField(source='coordinator.name', read_only=True)
    
    class Meta:
        model = Program
        fields = [
            'id', 'name', 'description', 'program_type', 'program_type_display',
            'coordinator', 'coordinator_name', 'start_date', 'end_date',
            'location', 'target_audience', 'capacity', 'registration_required',
            'is_active', 'image', 'created_at'
        ]