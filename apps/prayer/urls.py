from django.urls import path
from . import views

urlpatterns = [
    path('', views.PrayerRequestListView.as_view(), name='prayer-request-list'),
    path('create/', views.PrayerRequestCreateView.as_view(), name='prayer-request-create'),
    path('<int:pk>/', views.PrayerRequestDetailView.as_view(), name='prayer-request-detail'),
    path('<int:pk>/pray/', views.PrayForRequestView.as_view(), name='pray-for-request'),
    path('my-requests/', views.MyPrayerRequestsView.as_view(), name='my-prayer-requests'),
    path('categories/', views.PrayerCategoryListView.as_view(), name='prayer-categories'),
]
