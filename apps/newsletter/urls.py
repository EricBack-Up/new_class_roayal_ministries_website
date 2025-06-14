from django.urls import path
from . import views

urlpatterns = [
    path('subscribe/', views.NewsletterSubscribeView.as_view(), name='newsletter-subscribe'),
    path('unsubscribe/', views.NewsletterUnsubscribeView.as_view(), name='newsletter-unsubscribe'),
    path('confirm/<str:token>/', views.newsletter_confirm, name='newsletter-confirm'),
    path('unsubscribe/<str:token>/', views.newsletter_unsubscribe_token, name='newsletter-unsubscribe-token'),
]
