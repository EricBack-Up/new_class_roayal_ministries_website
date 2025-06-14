"""
Admin configuration for core app.
"""
from django.contrib import admin
from .models import ChurchInfo, Staff, Ministry, Announcement, VerseOfTheDay, ContactMessage


@admin.register(ChurchInfo)
class ChurchInfoAdmin(admin.ModelAdmin):
    list_display = ['name', 'phone', 'email', 'is_active']
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'tagline', 'description', 'logo', 'hero_image')
        }),
        ('Contact Information', {
            'fields': ('phone', 'email', 'address')
        }),
        ('Social Media', {
            'fields': ('facebook_url', 'instagram_url', 'youtube_url', 'twitter_url')
        }),
        ('Service Times', {
            'fields': ('sunday_service_time', 'wednesday_service_time')
        }),
        ('Settings', {
            'fields': ('is_active',)
        }),
    )


@admin.register(Staff)
class StaffAdmin(admin.ModelAdmin):
    list_display = ['name', 'position', 'email', 'is_active', 'order']
    list_filter = ['position', 'is_active']
    search_fields = ['name', 'email']
    ordering = ['order', 'name']
    fieldsets = (
        ('Basic Information', {
            'fields': ('user', 'name', 'position', 'bio', 'photo')
        }),
        ('Contact Information', {
            'fields': ('email', 'phone')
        }),
        ('Settings', {
            'fields': ('order', 'is_active')
        }),
    )


@admin.register(Ministry)
class MinistryAdmin(admin.ModelAdmin):
    list_display = ['name', 'leader', 'contact_email', 'is_active', 'order']
    list_filter = ['is_active', 'leader']
    search_fields = ['name', 'description']
    ordering = ['order', 'name']


@admin.register(Announcement)
class AnnouncementAdmin(admin.ModelAdmin):
    list_display = ['title', 'priority', 'start_date', 'end_date', 'is_active', 'is_current']
    list_filter = ['priority', 'is_active', 'start_date']
    search_fields = ['title', 'content']
    ordering = ['-start_date']
    readonly_fields = ['is_current']
    
    def save_model(self, request, obj, form, change):
        if not change:  # If creating new object
            obj.created_by = request.user
        super().save_model(request, obj, form, change)


@admin.register(VerseOfTheDay)
class VerseOfTheDayAdmin(admin.ModelAdmin):
    list_display = ['reference', 'date', 'is_active']
    list_filter = ['is_active', 'date']
    search_fields = ['reference', 'verse_text']
    ordering = ['-date']


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'subject', 'is_read', 'created_at']
    list_filter = ['is_read', 'created_at']
    search_fields = ['name', 'email', 'subject']
    ordering = ['-created_at']
    readonly_fields = ['created_at', 'updated_at']
    
    actions = ['mark_as_read', 'mark_as_unread']
    
    def mark_as_read(self, request, queryset):
        queryset.update(is_read=True)
    mark_as_read.short_description = "Mark selected messages as read"
    
    def mark_as_unread(self, request, queryset):
        queryset.update(is_read=False)
    mark_as_unread.short_description = "Mark selected messages as unread"
