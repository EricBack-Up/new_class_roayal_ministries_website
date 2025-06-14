"""
URLs for core app.
"""
from django.urls import path
from . import views

urlpatterns = [
    path('church-info/', views.ChurchInfoView.as_view(), name='church-info'),
    path('staff/', views.StaffListView.as_view(), name='staff-list'),
    path('ministries/', views.MinistryListView.as_view(), name='ministry-list'),
    path('announcements/', views.AnnouncementListView.as_view(), name='announcement-list'),
    path('verse-of-the-day/', views.verse_of_the_day, name='verse-of-the-day'),
    path('contact/', views.ContactMessageCreateView.as_view(), name='contact-create'),
    path('contact/messages/', views.ContactMessageListView.as_view(), name='contact-list'),
    path('stats/', views.church_stats, name='church-stats'),
]
