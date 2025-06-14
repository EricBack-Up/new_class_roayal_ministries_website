"""
Views for sermons app.
"""
from rest_framework import generics, status, filters
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q
from django.http import Http404

from .models import SermonSeries, Sermon, SermonComment, SermonPlaylist, SermonDownload
from .serializers import (
    SermonSeriesSerializer, SermonListSerializer, SermonDetailSerializer,
    SermonCommentSerializer, SermonCommentCreateSerializer,
    SermonPlaylistSerializer, SermonPlaylistCreateSerializer
)
from .filters import SermonFilter


class SermonSeriesListView(generics.ListAPIView):
    """
    List all active sermon series.
    """
    queryset = SermonSeries.objects.filter(is_active=True)
    serializer_class = SermonSeriesSerializer
    permission_classes = [AllowAny]


class SermonSeriesDetailView(generics.RetrieveAPIView):
    """
    Get details of a specific sermon series.
    """
    queryset = SermonSeries.objects.filter(is_active=True)
    serializer_class = SermonSeriesSerializer
    permission_classes = [AllowAny]


class SermonListView(generics.ListAPIView):
    """
    List all published sermons with filtering and search.
    """
    queryset = Sermon.objects.filter(is_published=True)
    serializer_class = SermonListSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = SermonFilter
    search_fields = ['title', 'description', 'scripture_reference', 'preacher__name']
    ordering_fields = ['date_preached', 'view_count', 'title']
    ordering = ['-date_preached']


class SermonDetailView(generics.RetrieveAPIView):
    """
    Get details of a specific sermon and increment view count.
    """
    queryset = Sermon.objects.filter(is_published=True)
    serializer_class = SermonDetailSerializer
    permission_classes = [AllowAny]
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        # Increment view count
        instance.increment_view_count()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)


class FeaturedSermonsView(generics.ListAPIView):
    """
    List featured sermons.
    """
    queryset = Sermon.objects.filter(is_published=True, is_featured=True)
    serializer_class = SermonListSerializer
    permission_classes = [AllowAny]


class RecentSermonsView(generics.ListAPIView):
    """
    List recent sermons (last 10).
    """
    queryset = Sermon.objects.filter(is_published=True)[:10]
    serializer_class = SermonListSerializer
    permission_classes = [AllowAny]


class PopularSermonsView(generics.ListAPIView):
    """
    List popular sermons by view count.
    """
    queryset = Sermon.objects.filter(is_published=True).order_by('-view_count')[:10]
    serializer_class = SermonListSerializer
    permission_classes = [AllowAny]


class SermonCommentListView(generics.ListAPIView):
    """
    List approved comments for a sermon.
    """
    serializer_class = SermonCommentSerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        sermon_id = self.kwargs['sermon_id']
        return SermonComment.objects.filter(
            sermon_id=sermon_id, 
            is_approved=True,
            parent__isnull=True  # Only top-level comments
        )


class SermonCommentCreateView(generics.CreateAPIView):
    """
    Create a new comment on a sermon.
    """
    queryset = SermonComment.objects.all()
    serializer_class = SermonCommentCreateSerializer
    permission_classes = [IsAuthenticated]
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class SermonPlaylistListView(generics.ListAPIView):
    """
    List public playlists or user's own playlists.
    """
    serializer_class = SermonPlaylistSerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        if self.request.user.is_authenticated:
            return SermonPlaylist.objects.filter(
                Q(is_public=True) | Q(created_by=self.request.user)
            )
        return SermonPlaylist.objects.filter(is_public=True)


class SermonPlaylistCreateView(generics.CreateAPIView):
    """
    Create a new sermon playlist.
    """
    queryset = SermonPlaylist.objects.all()
    serializer_class = SermonPlaylistCreateSerializer
    permission_classes = [IsAuthenticated]
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


class SermonPlaylistDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Get, update, or delete a sermon playlist.
    """
    serializer_class = SermonPlaylistSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return SermonPlaylist.objects.filter(
            Q(is_public=True) | Q(created_by=self.request.user)
        )


@api_view(['POST'])
@permission_classes([AllowAny])
def track_sermon_download(request, sermon_id):
    """
    Track sermon download.
    """
    try:
        sermon = Sermon.objects.get(id=sermon_id, is_published=True)
        file_type = request.data.get('file_type', 'audio')
        
        # Create download record
        SermonDownload.objects.create(
            sermon=sermon,
            user=request.user if request.user.is_authenticated else None,
            ip_address=request.META.get('REMOTE_ADDR', ''),
            file_type=file_type
        )
        
        # Increment download count
        sermon.increment_download_count()
        
        return Response({'message': 'Download tracked successfully'})
    except Sermon.DoesNotExist:
        raise Http404("Sermon not found")


@api_view(['GET'])
@permission_classes([AllowAny])
def sermon_search(request):
    """
    Advanced sermon search with multiple criteria.
    """
    query = request.GET.get('q', '')
    preacher = request.GET.get('preacher', '')
    series = request.GET.get('series', '')
    tags = request.GET.get('tags', '')
    
    sermons = Sermon.objects.filter(is_published=True)
    
    if query:
        sermons = sermons.filter(
            Q(title__icontains=query) |
            Q(description__icontains=query) |
            Q(scripture_reference__icontains=query)
        )
    
    if preacher:
        sermons = sermons.filter(preacher__name__icontains=preacher)
    
    if series:
        sermons = sermons.filter(series__title__icontains=series)
    
    if tags:
        tag_list = [tag.strip() for tag in tags.split(',')]
        sermons = sermons.filter(tags__name__in=tag_list).distinct()
    
    serializer = SermonListSerializer(sermons, many=True)
    return Response(serializer.data)
