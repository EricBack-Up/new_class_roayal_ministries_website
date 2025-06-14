"""
Views for prayer app.
"""
from rest_framework import generics, status, filters
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django_filters.rest_framework import DjangoFilterBackend

from .models import PrayerRequest, Prayer, PrayerCategory
from .serializers import (
    PrayerRequestSerializer, PrayerRequestListSerializer, PrayerRequestCreateSerializer,
    PrayForRequestSerializer, PrayerCategorySerializer
)


class PrayerRequestListView(generics.ListAPIView):
    """
    List public prayer requests.
    """
    serializer_class = PrayerRequestListSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'urgency', 'status', 'is_answered']
    search_fields = ['title', 'request_text']
    ordering_fields = ['created_at', 'urgency', 'prayer_count']
    ordering = ['-urgency', '-created_at']
    
    def get_queryset(self):
        return PrayerRequest.objects.filter(
            is_public=True,
            is_approved=True,
            status='active'
        ).select_related('category')


class PrayerRequestCreateView(generics.CreateAPIView):
    """
    Create a new prayer request.
    """
    serializer_class = PrayerRequestCreateSerializer
    permission_classes = [AllowAny]
    
    def perform_create(self, serializer):
        # Set the user if authenticated
        user = self.request.user if self.request.user.is_authenticated else None
        serializer.save(user=user)


class PrayerRequestDetailView(generics.RetrieveAPIView):
    """
    Get prayer request details.
    """
    serializer_class = PrayerRequestSerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        return PrayerRequest.objects.filter(
            is_public=True,
            is_approved=True
        ).select_related('category').prefetch_related('prayers')


class PrayForRequestView(generics.CreateAPIView):
    """
    Pray for a prayer request.
    """
    serializer_class = PrayForRequestSerializer
    permission_classes = [AllowAny]
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        prayer_request = get_object_or_404(
            PrayerRequest,
            pk=self.kwargs['pk'],
            is_public=True,
            is_approved=True
        )
        context['prayer_request'] = prayer_request
        return context
    
    def create(self, request, *args, **kwargs):
        # Check if user already prayed for this request
        prayer_request_id = self.kwargs['pk']
        user = request.user if request.user.is_authenticated else None
        
        if user and Prayer.objects.filter(
            prayer_request_id=prayer_request_id,
            user=user
        ).exists():
            return Response(
                {'message': 'You have already prayed for this request.'},
                status=status.HTTP_200_OK
            )
        
        return super().create(request, *args, **kwargs)


class MyPrayerRequestsView(generics.ListAPIView):
    """
    List prayer requests created by the authenticated user.
    """
    serializer_class = PrayerRequestSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return PrayerRequest.objects.filter(
            user=self.request.user
        ).select_related('category').prefetch_related('prayers')


class PrayerCategoryListView(generics.ListAPIView):
    """
    List all active prayer categories.
    """
    queryset = PrayerCategory.objects.filter(is_active=True)
    serializer_class = PrayerCategorySerializer
    permission_classes = [AllowAny]


@api_view(['GET'])
@permission_classes([AllowAny])
def prayer_stats(request):
    """
    Get prayer statistics.
    """
    from django.db.models import Sum, Count
    
    stats = {
        'total_requests': PrayerRequest.objects.filter(is_approved=True).count(),
        'active_requests': PrayerRequest.objects.filter(
            is_approved=True,
            status='active'
        ).count(),
        'answered_requests': PrayerRequest.objects.filter(
            is_approved=True,
            is_answered=True
        ).count(),
        'total_prayers': Prayer.objects.count(),
        'public_requests': PrayerRequest.objects.filter(
            is_public=True,
            is_approved=True
        ).count(),
    }
    
    return Response(stats)
