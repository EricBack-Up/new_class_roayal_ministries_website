"""
Views for core app.
"""
from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from django.utils import timezone
from django.core.mail import send_mail
from django.conf import settings

from .models import ChurchInfo, Staff, Ministry, Announcement, VerseOfTheDay, ContactMessage, Program
from .serializers import (
    ChurchInfoSerializer, StaffSerializer, MinistrySerializer,
    AnnouncementSerializer, VerseOfTheDaySerializer, ContactMessageSerializer,
    ContactMessageCreateSerializer, ProgramSerializer
)


class ChurchInfoView(generics.RetrieveAPIView):
    """
    Get church information.
    """
    queryset = ChurchInfo.objects.filter(is_active=True)
    serializer_class = ChurchInfoSerializer
    permission_classes = [AllowAny]
    
    def get_object(self):
        return self.queryset.first()


class StaffListView(generics.ListAPIView):
    """
    List all active staff members.
    """
    queryset = Staff.objects.filter(is_active=True)
    serializer_class = StaffSerializer
    permission_classes = [AllowAny]


class MinistryListView(generics.ListAPIView):
    """
    List all active ministries.
    """
    queryset = Ministry.objects.filter(is_active=True)
    serializer_class = MinistrySerializer
    permission_classes = [AllowAny]


class AnnouncementListView(generics.ListAPIView):
    """
    List current announcements.
    """
    serializer_class = AnnouncementSerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        now = timezone.now()
        return Announcement.objects.filter(
            is_active=True,
            start_date__lte=now,
            end_date__gte=now
        )


@api_view(['GET'])
@permission_classes([AllowAny])
def verse_of_the_day(request):
    """
    Get today's verse of the day.
    """
    today = timezone.now().date()
    try:
        verse = VerseOfTheDay.objects.get(date=today, is_active=True)
        serializer = VerseOfTheDaySerializer(verse)
        return Response(serializer.data)
    except VerseOfTheDay.DoesNotExist:
        # Return the most recent verse if today's is not available
        verse = VerseOfTheDay.objects.filter(is_active=True).first()
        if verse:
            serializer = VerseOfTheDaySerializer(verse)
            return Response(serializer.data)
        return Response({'message': 'No verse available'}, status=status.HTTP_404_NOT_FOUND)


class ContactMessageCreateView(generics.CreateAPIView):
    """
    Create a new contact message.
    """
    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageCreateSerializer
    permission_classes = [AllowAny]
    
    def perform_create(self, serializer):
        message = serializer.save()
        
        # Send email notification to church admin
        try:
            send_mail(
                subject=f'New Contact Message: {message.subject}',
                message=f'''
                New contact message received from New Class Royal Ministries website:
                
                Name: {message.name}
                Email: {message.email}
                Phone: {message.phone}
                Subject: {message.subject}
                Message Type: {message.get_message_type_display()}
                
                Message:
                {message.message}
                
                Received at: {message.created_at}
                
                Please respond promptly to serve our community effectively.
                
                Blessings,
                New Class Royal Ministries Website System
                ''',
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[settings.DEFAULT_FROM_EMAIL],
                fail_silently=True,
            )
        except Exception:
            pass  # Don't fail if email sending fails


class ContactMessageListView(generics.ListAPIView):
    """
    List contact messages (admin only).
    """
    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        # Only allow staff to view messages
        if self.request.user.is_staff:
            return ContactMessage.objects.all()
        return ContactMessage.objects.none()


class ProgramListView(generics.ListAPIView):
    """
    List all active programs.
    """
    queryset = Program.objects.filter(is_active=True)
    serializer_class = ProgramSerializer
    permission_classes = [AllowAny]


class ProgramDetailView(generics.RetrieveAPIView):
    """
    Get program details.
    """
    queryset = Program.objects.filter(is_active=True)
    serializer_class = ProgramSerializer
    permission_classes = [AllowAny]


@api_view(['GET'])
@permission_classes([AllowAny])
def church_stats(request):
    """
    Get basic church statistics.
    """
    stats = {
        'total_staff': Staff.objects.filter(is_active=True).count(),
        'total_ministries': Ministry.objects.filter(is_active=True).count(),
        'active_announcements': Announcement.objects.filter(
            is_active=True,
            start_date__lte=timezone.now(),
            end_date__gte=timezone.now()
        ).count(),
        'active_programs': Program.objects.filter(is_active=True).count(),
        'ministry_types': Ministry.objects.filter(is_active=True).values_list('ministry_type', flat=True).distinct().count(),
    }
    return Response(stats)