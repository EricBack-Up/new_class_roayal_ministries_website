"""
Views for newsletter app.
"""
from django.shortcuts import get_object_or_404
from django.http import HttpResponse
from django.utils import timezone
from django.core.mail import send_mail
from django.conf import settings
from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from .models import NewsletterSubscriber
from .serializers import (
    NewsletterSubscribeSerializer, NewsletterUnsubscribeSerializer,
    NewsletterSubscriberSerializer
)


class NewsletterSubscribeView(generics.CreateAPIView):
    """
    Subscribe to newsletter.
    """
    serializer_class = NewsletterSubscribeSerializer
    permission_classes = [AllowAny]
    
    def perform_create(self, serializer):
        subscriber = serializer.save()
        
        # Send confirmation email
        try:
            confirmation_url = f"{settings.FRONTEND_URL}/newsletter/confirm/{subscriber.confirmation_token}"
            send_mail(
                subject='Confirm Your Newsletter Subscription',
                message=f'''
                Thank you for subscribing to our newsletter!
                
                Please click the link below to confirm your subscription:
                {confirmation_url}
                
                If you didn't subscribe to our newsletter, please ignore this email.
                
                Blessings,
                New Class Royal Ministries
                ''',
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[subscriber.email],
                fail_silently=True,
            )
        except Exception:
            pass  # Don't fail if email sending fails
    
    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        if response.status_code == status.HTTP_201_CREATED:
            return Response({
                'message': 'Thank you for subscribing! Please check your email to confirm your subscription.',
                'email': response.data.get('email')
            }, status=status.HTTP_201_CREATED)
        return response


class NewsletterUnsubscribeView(generics.CreateAPIView):
    """
    Unsubscribe from newsletter.
    """
    serializer_class = NewsletterUnsubscribeSerializer
    permission_classes = [AllowAny]
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        subscriber = serializer.save()
        
        return Response({
            'message': 'You have been successfully unsubscribed from our newsletter.',
            'email': subscriber.email
        }, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([AllowAny])
def newsletter_confirm(request, token):
    """
    Confirm newsletter subscription via token.
    """
    try:
        subscriber = NewsletterSubscriber.objects.get(
            confirmation_token=token,
            is_active=True
        )
        
        if not subscriber.is_confirmed:
            subscriber.is_confirmed = True
            subscriber.confirmed_at = timezone.now()
            subscriber.save()
            
            message = "Thank you! Your newsletter subscription has been confirmed."
        else:
            message = "Your subscription was already confirmed."
        
        # Return HTML response for better user experience
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <title>Newsletter Confirmation</title>
            <style>
                body {{ font-family: Arial, sans-serif; text-align: center; padding: 50px; }}
                .container {{ max-width: 600px; margin: 0 auto; }}
                .success {{ color: #28a745; }}
            </style>
        </head>
        <body>
            <div class="container">
                <h1 class="success">Newsletter Subscription Confirmed</h1>
                <p>{message}</p>
                <p>You will now receive our newsletter updates.</p>
                <a href="{getattr(settings, 'FRONTEND_URL', '/')}">Return to Website</a>
            </div>
        </body>
        </html>
        """
        return HttpResponse(html_content)
        
    except NewsletterSubscriber.DoesNotExist:
        html_content = """
        <!DOCTYPE html>
        <html>
        <head>
            <title>Invalid Confirmation</title>
            <style>
                body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
                .container { max-width: 600px; margin: 0 auto; }
                .error { color: #dc3545; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1 class="error">Invalid Confirmation Link</h1>
                <p>This confirmation link is invalid or has expired.</p>
                <p>Please try subscribing again.</p>
            </div>
        </body>
        </html>
        """
        return HttpResponse(html_content, status=400)


@api_view(['GET'])
@permission_classes([AllowAny])
def newsletter_unsubscribe_token(request, token):
    """
    Unsubscribe from newsletter via token.
    """
    try:
        subscriber = NewsletterSubscriber.objects.get(
            unsubscribe_token=token,
            is_active=True
        )
        
        subscriber.is_active = False
        subscriber.unsubscribed_at = timezone.now()
        subscriber.save()
        
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <title>Newsletter Unsubscribed</title>
            <style>
                body {{ font-family: Arial, sans-serif; text-align: center; padding: 50px; }}
                .container {{ max-width: 600px; margin: 0 auto; }}
                .info {{ color: #17a2b8; }}
            </style>
        </head>
        <body>
            <div class="container">
                <h1 class="info">Successfully Unsubscribed</h1>
                <p>You have been unsubscribed from our newsletter.</p>
                <p>We're sorry to see you go!</p>
                <a href="{getattr(settings, 'FRONTEND_URL', '/')}">Return to Website</a>
            </div>
        </body>
        </html>
        """
        return HttpResponse(html_content)
        
    except NewsletterSubscriber.DoesNotExist:
        html_content = """
        <!DOCTYPE html>
        <html>
        <head>
            <title>Invalid Unsubscribe Link</title>
            <style>
                body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
                .container { max-width: 600px; margin: 0 auto; }
                .error { color: #dc3545; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1 class="error">Invalid Unsubscribe Link</h1>
                <p>This unsubscribe link is invalid or has expired.</p>
            </div>
        </body>
        </html>
        """
        return HttpResponse(html_content, status=400)


@api_view(['GET'])
@permission_classes([AllowAny])
def newsletter_stats(request):
    """
    Get newsletter statistics.
    """
    stats = {
        'total_subscribers': NewsletterSubscriber.objects.filter(is_active=True).count(),
        'confirmed_subscribers': NewsletterSubscriber.objects.filter(
            is_active=True,
            is_confirmed=True
        ).count(),
        'weekly_subscribers': NewsletterSubscriber.objects.filter(
            is_active=True,
            frequency='weekly'
        ).count(),
        'monthly_subscribers': NewsletterSubscriber.objects.filter(
            is_active=True,
            frequency='monthly'
        ).count(),
    }
    
    return Response(stats)
