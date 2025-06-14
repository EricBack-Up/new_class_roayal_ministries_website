"""
Serializers for livestream app.
"""
from rest_framework import serializers
from .models import LiveStream, StreamViewer, StreamComment


class LiveStreamSerializer(serializers.ModelSerializer):
    """
    Serializer for live streams.
    """
    stream_type_display = serializers.CharField(source='get_stream_type_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    is_live = serializers.ReadOnlyField()
    is_upcoming = serializers.ReadOnlyField()
    primary_stream_url = serializers.ReadOnlyField()
    
    class Meta:
        model = LiveStream
        fields = [
            'id', 'title', 'description', 'stream_type', 'stream_type_display',
            'youtube_url', 'facebook_url', 'zoom_url', 'other_platform_url',
            'scheduled_start', 'scheduled_end', 'actual_start', 'actual_end',
            'status', 'status_display', 'is_featured', 'is_public',
            'viewer_count', 'max_viewers', 'thumbnail', 'is_live', 
            'is_upcoming', 'primary_stream_url', 'created_at'
        ]


class LiveStreamListSerializer(serializers.ModelSerializer):
    """
    Simplified serializer for stream lists.
    """
    stream_type_display = serializers.CharField(source='get_stream_type_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    is_live = serializers.ReadOnlyField()
    is_upcoming = serializers.ReadOnlyField()
    primary_stream_url = serializers.ReadOnlyField()
    
    class Meta:
        model = LiveStream
        fields = [
            'id', 'title', 'description', 'stream_type', 'stream_type_display',
            'scheduled_start', 'status', 'status_display', 'is_featured',
            'viewer_count', 'thumbnail', 'is_live', 'is_upcoming', 
            'primary_stream_url'
        ]


class StreamCommentSerializer(serializers.ModelSerializer):
    """
    Serializer for stream comments.
    """
    class Meta:
        model = StreamComment
        fields = [
            'id', 'stream', 'name', 'comment', 'is_approved', 
            'is_highlighted', 'created_at'
        ]
        read_only_fields = ['is_approved', 'is_highlighted']


class StreamCommentCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating stream comments.
    """
    class Meta:
        model = StreamComment
        fields = ['name', 'email', 'comment']