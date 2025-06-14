"""
Serializers for sermons app.
"""
from rest_framework import serializers
from taggit.serializers import TagListSerializerField, TaggitSerializer
from .models import SermonSeries, Sermon, SermonComment, SermonPlaylist, PlaylistItem


class SermonSeriesSerializer(serializers.ModelSerializer):
    sermon_count = serializers.ReadOnlyField()
    
    class Meta:
        model = SermonSeries
        fields = [
            'id', 'title', 'description', 'image', 'start_date', 
            'end_date', 'is_active', 'sermon_count', 'created_at'
        ]


class SermonListSerializer(TaggitSerializer, serializers.ModelSerializer):
    preacher_name = serializers.CharField(source='preacher.name', read_only=True)
    series_title = serializers.CharField(source='series.title', read_only=True)
    tags = TagListSerializerField()
    
    class Meta:
        model = Sermon
        fields = [
            'id', 'title', 'description', 'preacher', 'preacher_name',
            'series', 'series_title', 'scripture_reference', 'thumbnail',
            'date_preached', 'duration_minutes', 'view_count', 'download_count',
            'is_published', 'is_featured', 'tags', 'created_at'
        ]


class SermonDetailSerializer(TaggitSerializer, serializers.ModelSerializer):
    preacher_name = serializers.CharField(source='preacher.name', read_only=True)
    preacher_photo = serializers.ImageField(source='preacher.photo', read_only=True)
    series_title = serializers.CharField(source='series.title', read_only=True)
    tags = TagListSerializerField()
    comments_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Sermon
        fields = [
            'id', 'title', 'description', 'preacher', 'preacher_name', 'preacher_photo',
            'series', 'series_title', 'scripture_reference', 'audio_file', 'video_file',
            'video_url', 'sermon_notes', 'thumbnail', 'date_preached', 'duration_minutes',
            'view_count', 'download_count', 'is_published', 'is_featured', 'tags',
            'comments_count', 'created_at', 'updated_at'
        ]
    
    def get_comments_count(self, obj):
        return obj.comments.filter(is_approved=True).count()


class SermonCommentSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    replies = serializers.SerializerMethodField()
    
    class Meta:
        model = SermonComment
        fields = [
            'id', 'sermon', 'user', 'user_name', 'comment', 'is_approved',
            'parent', 'replies', 'created_at'
        ]
        read_only_fields = ['user', 'is_approved']
    
    def get_replies(self, obj):
        if obj.replies.exists():
            return SermonCommentSerializer(
                obj.replies.filter(is_approved=True), 
                many=True, 
                context=self.context
            ).data
        return []


class SermonCommentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = SermonComment
        fields = ['sermon', 'comment', 'parent']


class PlaylistItemSerializer(serializers.ModelSerializer):
    sermon_title = serializers.CharField(source='sermon.title', read_only=True)
    sermon_preacher = serializers.CharField(source='sermon.preacher.name', read_only=True)
    sermon_thumbnail = serializers.ImageField(source='sermon.thumbnail', read_only=True)
    sermon_duration = serializers.IntegerField(source='sermon.duration_minutes', read_only=True)
    
    class Meta:
        model = PlaylistItem
        fields = [
            'id', 'sermon', 'sermon_title', 'sermon_preacher', 
            'sermon_thumbnail', 'sermon_duration', 'order'
        ]


class SermonPlaylistSerializer(serializers.ModelSerializer):
    created_by_name = serializers.CharField(source='created_by.get_full_name', read_only=True)
    sermons_count = serializers.SerializerMethodField()
    items = PlaylistItemSerializer(source='playlistitem_set', many=True, read_only=True)
    
    class Meta:
        model = SermonPlaylist
        fields = [
            'id', 'name', 'description', 'created_by', 'created_by_name',
            'is_public', 'sermons_count', 'items', 'created_at'
        ]
        read_only_fields = ['created_by']
    
    def get_sermons_count(self, obj):
        return obj.sermons.count()


class SermonPlaylistCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = SermonPlaylist
        fields = ['name', 'description', 'is_public']
