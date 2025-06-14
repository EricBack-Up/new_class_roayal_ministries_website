"""
URLs for sermons app.
"""
from django.urls import path
from . import views

urlpatterns = [
    # Sermon Series
    path('series/', views.SermonSeriesListView.as_view(), name='sermon-series-list'),
    path('series/<int:pk>/', views.SermonSeriesDetailView.as_view(), name='sermon-series-detail'),
    
    # Sermons
    path('', views.SermonListView.as_view(), name='sermon-list'),
    path('<int:pk>/', views.SermonDetailView.as_view(), name='sermon-detail'),
    path('featured/', views.FeaturedSermonsView.as_view(), name='featured-sermons'),
    path('recent/', views.RecentSermonsView.as_view(), name='recent-sermons'),
    path('popular/', views.PopularSermonsView.as_view(), name='popular-sermons'),
    path('search/', views.sermon_search, name='sermon-search'),
    
    # Comments
    path('<int:sermon_id>/comments/', views.SermonCommentListView.as_view(), name='sermon-comments'),
    path('comments/', views.SermonCommentCreateView.as_view(), name='sermon-comment-create'),
    
    # Playlists
    path('playlists/', views.SermonPlaylistListView.as_view(), name='playlist-list'),
    path('playlists/create/', views.SermonPlaylistCreateView.as_view(), name='playlist-create'),
    path('playlists/<int:pk>/', views.SermonPlaylistDetailView.as_view(), name='playlist-detail'),
    
    # Downloads
    path('<int:sermon_id>/download/', views.track_sermon_download, name='track-download'),
]
