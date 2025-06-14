"""
Views for livestream app.
"""
from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from django.utils import timezone
from django.shortcuts import get_object_or_404

from .models import LiveStream, StreamComment, StreamViewer
from .serializers import (
    LiveStreamSerializer, LiveStreamListSerializer,
    StreamCommentSerializer, StreamCommentCreateSerializer
)


class LiveStreamListView(generics.ListAPIView):
    """
    List all public live streams.
    """
    queryset = LiveStream.objects.filter(is_public=True)
    serializer_class = LiveStreamListSerializer
    permission_classes = [AllowAny]
    ordering = ['-scheduled_start']


class LiveStreamDetailView(generics.RetrieveAPIView):
    """
    Get live stream details.
    """
    queryset = LiveStream.objects.filter(is_public=True)
    serializer_class = LiveStreamSerializer
    permission_classes = [AllowAny]


class CurrentLiveStreamView(generics.ListAPIView):
    """
    Get currently live streams.
    """
    serializer_class = LiveStreamSerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        return LiveStream.objects.filter(
            is_public=True,
            status='live'
        )


class UpcomingStreamsView(generics.ListAPIView):
    """
    Get upcoming live streams.
    """
    serializer_class = LiveStreamListSerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        return LiveStream.objects.filter(
            is_public=True,
            status='scheduled',
            scheduled_start__gt=timezone.now()
        )[:5]


class StreamCommentListView(generics.ListAPIView):
    """
    List approved comments for a stream.
    """
    serializer_class = StreamCommentSerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        stream_id = self.kwargs['stream_id']
        return StreamComment.objects.filter(
            stream_id=stream_id,
            is_approved=True
        )


class StreamCommentCreateView(generics.CreateAPIView):
    """
    Create a new stream comment.
    """
    serializer_class = StreamCommentCreateSerializer
    permission_classes = [AllowAny]
    
    def perform_create(self, serializer):
        stream_id = self.kwargs['stream_id']
        stream = get_object_or_404(LiveStream, id=stream_id, is_public=True)
        serializer.save(stream=stream)


@api_view(['POST'])
@permission_classes([AllowAny])
def join_stream(request, stream_id):
    """
    Track when a viewer joins a stream.
    """
    try:
        stream = LiveStream.objects.get(id=stream_id, is_public=True)
        
        # Create viewer record
        StreamViewer.objects.create(
            stream=stream,
            ip_address=request.META.get('REMOTE_ADDR', ''),
            user_agent=request.META.get('HTTP_USER_AGENT', '')
        )
        
        # Update viewer count
        stream.viewer_count += 1
        if stream.viewer_count > stream.max_viewers:
            stream.max_viewers = stream.viewer_count
        stream.save()
        
        return Response({'message': 'Joined stream successfully'})
    except LiveStream.DoesNotExist:
        return Response(
            {'error': 'Stream not found'}, 
            status=status.HTTP_404_NOT_FOUND
        )


@api_view(['POST'])
@permission_classes([AllowAny])
def leave_stream(request, stream_id):
    """
    Track when a viewer leaves a stream.
    """
    try:
        stream = LiveStream.objects.get(id=stream_id, is_public=True)
        
        # Update viewer count
        if stream.viewer_count > 0:
            stream.viewer_count -= 1
            stream.save()
        
        return Response({'message': 'Left stream successfully'})
    except LiveStream.DoesNotExist:
        return Response(
            {'error': 'Stream not found'}, 
            status=status.HTTP_404_NOT_FOUND
        )


@api_view(['GET'])
@permission_classes([AllowAny])
def stream_stats(request):
    """
    Get livestream statistics.
    """
    stats = {
        'total_streams': LiveStream.objects.count(),
        'live_streams': LiveStream.objects.filter(status='live').count(),
        'upcoming_streams': LiveStream.objects.filter(
            status='scheduled',
            scheduled_start__gt=timezone.now()
        ).count(),
        'total_viewers_today': StreamViewer.objects.filter(
            joined_at__date=timezone.now().date()
        ).count(),
    }
    
    return Response(stats)