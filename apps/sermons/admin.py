"""
Admin configuration for sermons app.
"""
from django.contrib import admin
from .models import SermonSeries, Sermon, SermonComment, SermonPlaylist, PlaylistItem, SermonDownload


@admin.register(SermonSeries)
class SermonSeriesAdmin(admin.ModelAdmin):
    list_display = ['title', 'start_date', 'end_date', 'sermon_count', 'is_active']
    list_filter = ['is_active', 'start_date']
    search_fields = ['title', 'description']
    ordering = ['-start_date']
    readonly_fields = ['sermon_count']


@admin.register(Sermon)
class SermonAdmin(admin.ModelAdmin):
    list_display = ['title', 'preacher', 'series', 'date_preached', 'is_published', 'is_featured', 'view_count']
    list_filter = ['is_published', 'is_featured', 'preacher', 'series', 'date_preached']
    search_fields = ['title', 'description', 'scripture_reference']
    ordering = ['-date_preached']
    readonly_fields = ['view_count', 'download_count', 'created_at', 'updated_at']
    filter_horizontal = ['tags']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'description', 'preacher', 'series', 'scripture_reference')
        }),
        ('Media Files', {
            'fields': ('audio_file', 'video_file', 'video_url', 'sermon_notes', 'thumbnail')
        }),
        ('Metadata', {
            'fields': ('date_preached', 'duration_minutes', 'tags')
        }),
        ('Publishing', {
            'fields': ('is_published', 'is_featured')
        }),
        ('Statistics', {
            'fields': ('view_count', 'download_count'),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(SermonComment)
class SermonCommentAdmin(admin.ModelAdmin):
    list_display = ['sermon', 'user', 'is_approved', 'created_at']
    list_filter = ['is_approved', 'created_at']
    search_fields = ['sermon__title', 'user__username', 'comment']
    ordering = ['-created_at']
    actions = ['approve_comments', 'disapprove_comments']
    
    def approve_comments(self, request, queryset):
        queryset.update(is_approved=True)
    approve_comments.short_description = "Approve selected comments"
    
    def disapprove_comments(self, request, queryset):
        queryset.update(is_approved=False)
    disapprove_comments.short_description = "Disapprove selected comments"


class PlaylistItemInline(admin.TabularInline):
    model = PlaylistItem
    extra = 0
    ordering = ['order']


@admin.register(SermonPlaylist)
class SermonPlaylistAdmin(admin.ModelAdmin):
    list_display = ['name', 'created_by', 'is_public', 'sermons_count', 'created_at']
    list_filter = ['is_public', 'created_at']
    search_fields = ['name', 'description']
    ordering = ['-created_at']
    inlines = [PlaylistItemInline]
    readonly_fields = ['sermons_count']
    
    def sermons_count(self, obj):
        return obj.sermons.count()
    sermons_count.short_description = "Number of Sermons"


@admin.register(SermonDownload)
class SermonDownloadAdmin(admin.ModelAdmin):
    list_display = ['sermon', 'user', 'file_type', 'ip_address', 'created_at']
    list_filter = ['file_type', 'created_at']
    search_fields = ['sermon__title', 'user__username']
    ordering = ['-created_at']
    readonly_fields = ['created_at']
