"""
Admin configuration for livestream app.
"""
from django.contrib import admin
from django.utils.html import format_html
from .models import LiveStream, StreamViewer, StreamComment


@admin.register(LiveStream)
class LiveStreamAdmin(admin.ModelAdmin):
    list_display = [
        'title', 'stream_type', 'scheduled_start', 'status', 
        'viewer_count', 'max_viewers', 'is_featured', 'is_public'
    ]
    list_filter = ['stream_type', 'status', 'is_featured', 'is_public', 'scheduled_start']
    search_fields = ['title', 'description']
    ordering = ['-scheduled_start']
    date_hierarchy = 'scheduled_start'
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'description', 'stream_type', 'thumbnail')
        }),
        ('Stream URLs', {
            'fields': ('youtube_url', 'facebook_url', 'zoom_url', 'other_platform_url')
        }),
        ('Schedule', {
            'fields': ('scheduled_start', 'scheduled_end', 'actual_start', 'actual_end')
        }),
        ('Status & Settings', {
            'fields': ('status', 'is_featured', 'is_public')
        }),
        ('Statistics', {
            'fields': ('viewer_count', 'max_viewers'),
            'classes': ('collapse',)
        }),
    )
    
    readonly_fields = ['viewer_count', 'max_viewers']
    
    actions = ['mark_as_live', 'mark_as_ended', 'feature_streams']
    
    def mark_as_live(self, request, queryset):
        queryset.update(status='live')
    mark_as_live.short_description = "Mark selected streams as live"
    
    def mark_as_ended(self, request, queryset):
        queryset.update(status='ended')
    mark_as_ended.short_description = "Mark selected streams as ended"
    
    def feature_streams(self, request, queryset):
        queryset.update(is_featured=True)
    feature_streams.short_description = "Feature selected streams"


@admin.register(StreamViewer)
class StreamViewerAdmin(admin.ModelAdmin):
    list_display = ['stream', 'ip_address', 'joined_at', 'left_at']
    list_filter = ['joined_at', 'stream']
    search_fields = ['stream__title', 'ip_address']
    ordering = ['-joined_at']
    readonly_fields = ['joined_at']


@admin.register(StreamComment)
class StreamCommentAdmin(admin.ModelAdmin):
    list_display = ['stream', 'name', 'is_approved', 'is_highlighted', 'created_at']
    list_filter = ['is_approved', 'is_highlighted', 'created_at']
    search_fields = ['stream__title', 'name', 'comment']
    ordering = ['-created_at']
    
    actions = ['approve_comments', 'highlight_comments']
    
    def approve_comments(self, request, queryset):
        queryset.update(is_approved=True)
    approve_comments.short_description = "Approve selected comments"
    
    def highlight_comments(self, request, queryset):
        queryset.update(is_highlighted=True)
    highlight_comments.short_description = "Highlight selected comments"