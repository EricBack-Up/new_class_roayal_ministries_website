"""
Views for events app.
"""
from rest_framework import generics, status, filters
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from django.utils import timezone
from django.db.models import Q
from django_filters.rest_framework import DjangoFilterBackend

from .models import Event, EventCategory, EventRegistration
from .serializers import (
    EventSerializer, EventListSerializer, EventCategorySerializer,
    EventRegistrationSerializer, EventRegistrationCreateSerializer
)


class EventListView(generics.ListAPIView):
    """
    List all published events with filtering and search.
    """
    serializer_class = EventListSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'ministry', 'requires_registration']
    search_fields = ['title', 'description', 'location']
    ordering_fields = ['start_datetime', 'created_at']
    ordering = ['start_datetime']
    
    def get_queryset(self):
        queryset = Event.objects.filter(is_published=True)
        
        # Filter by date range
        start_date = self.request.query_params.get('start_date')
        end_date = self.request.query_params.get('end_date')
        
        if start_date:
            queryset = queryset.filter(start_datetime__gte=start_date)
        if end_date:
            queryset = queryset.filter(end_datetime__lte=end_date)
        
        return queryset.select_related('category', 'ministry')


class EventDetailView(generics.RetrieveAPIView):
    """
    Get event details.
    """
    queryset = Event.objects.filter(is_published=True)
    serializer_class = EventSerializer
    permission_classes = [AllowAny]


class UpcomingEventsView(generics.ListAPIView):
    """
    List upcoming events.
    """
    serializer_class = EventListSerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        return Event.objects.filter(
            is_published=True,
            start_datetime__gt=timezone.now()
        ).select_related('category', 'ministry')[:10]


class FeaturedEventsView(generics.ListAPIView):
    """
    List featured events.
    """
    serializer_class = EventListSerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        return Event.objects.filter(
            is_published=True,
            is_featured=True,
            start_datetime__gt=timezone.now()
        ).select_related('category', 'ministry')[:5]


class EventCategoryListView(generics.ListAPIView):
    """
    List all active event categories.
    """
    queryset = EventCategory.objects.filter(is_active=True)
    serializer_class = EventCategorySerializer
    permission_classes = [AllowAny]


class EventRegistrationView(generics.CreateAPIView):
    """
    Register for an event.
    """
    serializer_class = EventRegistrationCreateSerializer
    permission_classes = [AllowAny]
    
    def perform_create(self, serializer):
        event_id = self.kwargs['pk']
        try:
            event = Event.objects.get(id=event_id, is_published=True)
        except Event.DoesNotExist:
            return Response(
                {'error': 'Event not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        if not event.is_registration_open:
            return Response(
                {'error': 'Registration is not open for this event'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Set the user if authenticated
        user = self.request.user if self.request.user.is_authenticated else None
        serializer.save(event=event, user=user)


@api_view(['GET'])
@permission_classes([AllowAny])
def event_calendar(request):
    """
    Get events in calendar format.
    """
    start_date = request.query_params.get('start')
    end_date = request.query_params.get('end')
    
    queryset = Event.objects.filter(is_published=True)
    
    if start_date:
        queryset = queryset.filter(start_datetime__gte=start_date)
    if end_date:
        queryset = queryset.filter(end_datetime__lte=end_date)
    
    events = []
    for event in queryset:
        events.append({
            'id': event.id,
            'title': event.title,
            'start': event.start_datetime.isoformat(),
            'end': event.end_datetime.isoformat(),
            'allDay': event.all_day,
            'color': event.category.color if event.category else '#3B82F6',
            'url': f'/events/{event.id}',
            'extendedProps': {
                'location': event.location,
                'category': event.category.name if event.category else '',
                'requiresRegistration': event.requires_registration,
            }
        })
    
    return Response(events)


# Add this to urls.py
EventCalendarView = event_calendar
