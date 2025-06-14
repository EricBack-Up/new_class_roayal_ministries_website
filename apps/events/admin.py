"""
Admin configuration for events app.
"""
from django.contrib import admin
from django.utils.html import format_html
from .models import Event, EventCategory, EventRegistration, EventAttendance, EventReminder


@admin.register(EventCategory)
class EventCategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'color_display', 'is_active', 'created_at']
    list_filter = ['is_active', 'created_at']
    search_fields = ['name', 'description']
    ordering = ['name']
    
    def color_display(self, obj):
        return format_html(
            '<div style="width: 20px; height: 20px; background-color: {}; border-radius: 3px;"></div>',
            obj.color
        )
    color_display.short_description = 'Color'


class EventRegistrationInline(admin.TabularInline):
    model = EventRegistration
    extra = 0
    readonly_fields = ['created_at', 'full_name']
    fields = ['full_name', 'email', 'phone', 'number_of_attendees', 'is_confirmed', 'payment_status']


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = [
        'title', 'category', 'start_datetime', 'location', 
        'registration_count', 'is_featured', 'is_published'
    ]
    list_filter = [
        'category', 'ministry', 'is_published', 'is_featured',
        'requires_registration', 'start_datetime'
    ]
    search_fields = ['title', 'description', 'location']
    ordering = ['-start_datetime']
    date_hierarchy = 'start_datetime'
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'description', 'category', 'ministry', 'image')
        }),
        ('Date & Time', {
            'fields': ('start_datetime', 'end_datetime', 'all_day')
        }),
        ('Location', {
            'fields': ('location', 'address', 'online_link')
        }),
        ('Registration', {
            'fields': (
                'requires_registration', 'max_attendees', 
                'registration_deadline', 'registration_fee'
            )
        }),
        ('Recurrence', {
            'fields': ('recurrence', 'recurrence_end_date'),
            'classes': ('collapse',)
        }),
        ('Contact Information', {
            'fields': ('contact_person', 'contact_email', 'contact_phone'),
            'classes': ('collapse',)
        }),
        ('Publishing', {
            'fields': ('is_published', 'is_featured')
        }),
    )
    
    inlines = [EventRegistrationInline]
    
    def registration_count(self, obj):
        return obj.registration_count
    registration_count.short_description = 'Registrations'


@admin.register(EventRegistration)
class EventRegistrationAdmin(admin.ModelAdmin):
    list_display = [
        'full_name', 'event', 'email', 'number_of_attendees',
        'is_confirmed', 'payment_status', 'created_at'
    ]
    list_filter = [
        'is_confirmed', 'payment_status', 'event__category',
        'created_at', 'event__start_datetime'
    ]
    search_fields = ['first_name', 'last_name', 'email', 'event__title']
    ordering = ['-created_at']
    date_hierarchy = 'created_at'
    
    readonly_fields = ['full_name', 'created_at']
    
    fieldsets = (
        ('Event', {
            'fields': ('event',)
        }),
        ('Registrant Information', {
            'fields': ('first_name', 'last_name', 'email', 'phone')
        }),
        ('Registration Details', {
            'fields': ('number_of_attendees', 'special_requirements')
        }),
        ('Status', {
            'fields': ('is_confirmed', 'attended', 'payment_status', 'payment_reference')
        }),
    )


@admin.register(EventAttendance)
class EventAttendanceAdmin(admin.ModelAdmin):
    list_display = ['name', 'event', 'check_in_time', 'check_out_time']
    list_filter = ['event', 'check_in_time']
    search_fields = ['name', 'email', 'event__title']
    ordering = ['-check_in_time']
    date_hierarchy = 'check_in_time'


@admin.register(EventReminder)
class EventReminderAdmin(admin.ModelAdmin):
    list_display = ['user', 'event', 'reminder_datetime', 'is_sent']
    list_filter = ['is_sent', 'reminder_datetime']
    search_fields = ['user__username', 'event__title']
    ordering = ['-reminder_datetime']
