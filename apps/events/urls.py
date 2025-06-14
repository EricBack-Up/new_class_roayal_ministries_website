from django.urls import path
from . import views

urlpatterns = [
    path('', views.EventListView.as_view(), name='event-list'),
    path('<int:pk>/', views.EventDetailView.as_view(), name='event-detail'),
    path('upcoming/', views.UpcomingEventsView.as_view(), name='upcoming-events'),
    path('featured/', views.FeaturedEventsView.as_view(), name='featured-events'),
    path('<int:pk>/register/', views.EventRegistrationView.as_view(), name='event-register'),
    path('categories/', views.EventCategoryListView.as_view(), name='event-categories'),
    path('calendar/', views.EventCalendarView.as_view(), name='event-calendar'),
]
