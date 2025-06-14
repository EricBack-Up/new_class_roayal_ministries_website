from django.contrib import admin
from .models import MemberProfile, MemberMinistry

@admin.register(MemberProfile)
class MemberProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'membership_status', 'date_joined_church']
    list_filter = ['membership_status']
    search_fields = ['user__username', 'user__email']

@admin.register(MemberMinistry)
class MemberMinistryAdmin(admin.ModelAdmin):
    list_display = ['member', 'ministry', 'role', 'is_active']
    list_filter = ['role', 'is_active']
