from django.urls import path
from . import views

urlpatterns = [
    path('', views.LiveStreamListView.as_view(), name='livestream-list'),
    path('<int:pk>/', views.LiveStreamDetailView.as_view(), name='livestream-detail'),
    path('current/', views.CurrentLiveStreamView.as_view(), name='current-livestream'),
    path('upcoming/', views.UpcomingStreamsView.as_view(), name='upcoming-streams'),
    path('<int:stream_id>/comments/', views.StreamCommentListView.as_view(), name='stream-comments'),
    path('<int:stream_id>/comment/', views.StreamCommentCreateView.as_view(), name='stream-comment-create'),
    path('<int:stream_id>/join/', views.join_stream, name='join-stream'),
    path('<int:stream_id>/leave/', views.leave_stream, name='leave-stream'),
    path('stats/', views.stream_stats, name='stream-stats'),
]