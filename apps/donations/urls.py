from django.urls import path
from . import views

urlpatterns = [
    path('', views.DonationCreateView.as_view(), name='donation-create'),
    path('history/', views.DonationHistoryView.as_view(), name='donation-history'),
    path('campaigns/', views.DonationCampaignListView.as_view(), name='donation-campaigns'),
    path('webhook/stripe/', views.stripe_webhook, name='stripe-webhook'),
    path('success/', views.donation_success, name='donation-success'),
    path('cancel/', views.donation_cancel, name='donation-cancel'),
]
