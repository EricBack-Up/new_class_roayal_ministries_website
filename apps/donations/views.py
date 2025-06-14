"""
Views for donations app.
"""
import stripe
import json
from django.conf import settings
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from django.utils.decorators import method_decorator
from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from .models import Donation, DonationCampaign
from .serializers import (
    DonationSerializer, DonationCreateSerializer, DonationHistorySerializer,
    DonationCampaignSerializer
)

# Configure Stripe
stripe.api_key = settings.STRIPE_SECRET_KEY if hasattr(settings, 'STRIPE_SECRET_KEY') else ''


class DonationCreateView(generics.CreateAPIView):
    """
    Create a new donation and process payment.
    """
    serializer_class = DonationCreateSerializer
    permission_classes = [AllowAny]
    
    def perform_create(self, serializer):
        # Set the user if authenticated
        user = self.request.user if self.request.user.is_authenticated else None
        donation = serializer.save(user=user)
        
        # Create Stripe payment intent if using Stripe
        if donation.payment_method == 'stripe' and stripe.api_key:
            try:
                intent = stripe.PaymentIntent.create(
                    amount=int(donation.amount * 100),  # Convert to cents
                    currency=donation.currency.lower(),
                    metadata={
                        'donation_id': donation.id,
                        'donor_name': donation.donor_name,
                        'donation_type': donation.donation_type,
                    }
                )
                donation.stripe_payment_intent_id = intent.id
                donation.transaction_id = intent.id
                donation.save()
                
                # Return the client secret for frontend
                return Response({
                    'donation_id': donation.id,
                    'client_secret': intent.client_secret,
                    'amount': donation.amount,
                })
            except stripe.error.StripeError as e:
                donation.status = 'failed'
                donation.save()
                return Response(
                    {'error': str(e)}, 
                    status=status.HTTP_400_BAD_REQUEST
                )


class DonationHistoryView(generics.ListAPIView):
    """
    Get donation history for authenticated user.
    """
    serializer_class = DonationHistorySerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Donation.objects.filter(
            user=self.request.user,
            status='completed'
        ).order_by('-created_at')


class DonationCampaignListView(generics.ListAPIView):
    """
    List active donation campaigns.
    """
    serializer_class = DonationCampaignSerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        return DonationCampaign.objects.filter(is_active=True).order_by('-is_featured', '-start_date')


@csrf_exempt
@require_POST
def stripe_webhook(request):
    """
    Handle Stripe webhook events.
    """
    payload = request.body
    sig_header = request.META.get('HTTP_STRIPE_SIGNATURE')
    endpoint_secret = getattr(settings, 'STRIPE_WEBHOOK_SECRET', '')
    
    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, endpoint_secret
        )
    except ValueError:
        return HttpResponse(status=400)
    except stripe.error.SignatureVerificationError:
        return HttpResponse(status=400)
    
    # Handle the event
    if event['type'] == 'payment_intent.succeeded':
        payment_intent = event['data']['object']
        
        try:
            donation = Donation.objects.get(
                stripe_payment_intent_id=payment_intent['id']
            )
            donation.status = 'completed'
            donation.processed_at = timezone.now()
            donation.save()
            
            # Update campaign amount if applicable
            if donation.campaign:
                donation.campaign.current_amount += donation.amount
                donation.campaign.save()
                
        except Donation.DoesNotExist:
            pass
    
    elif event['type'] == 'payment_intent.payment_failed':
        payment_intent = event['data']['object']
        
        try:
            donation = Donation.objects.get(
                stripe_payment_intent_id=payment_intent['id']
            )
            donation.status = 'failed'
            donation.save()
        except Donation.DoesNotExist:
            pass
    
    return HttpResponse(status=200)


@api_view(['GET'])
@permission_classes([AllowAny])
def donation_success(request):
    """
    Handle successful donation redirect.
    """
    return Response({'message': 'Thank you for your donation!'})


@api_view(['GET'])
@permission_classes([AllowAny])
def donation_cancel(request):
    """
    Handle cancelled donation redirect.
    """
    return Response({'message': 'Donation was cancelled.'})


@api_view(['GET'])
@permission_classes([AllowAny])
def donation_stats(request):
    """
    Get donation statistics.
    """
    from django.db.models import Sum, Count
    from django.utils import timezone
    from datetime import timedelta
    
    # Calculate stats
    total_donations = Donation.objects.filter(status='completed').aggregate(
        total_amount=Sum('amount'),
        total_count=Count('id')
    )
    
    # This month's donations
    this_month = timezone.now().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    monthly_donations = Donation.objects.filter(
        status='completed',
        created_at__gte=this_month
    ).aggregate(
        monthly_amount=Sum('amount'),
        monthly_count=Count('id')
    )
    
    stats = {
        'total_amount': total_donations['total_amount'] or 0,
        'total_donations': total_donations['total_count'] or 0,
        'monthly_amount': monthly_donations['monthly_amount'] or 0,
        'monthly_donations': monthly_donations['monthly_count'] or 0,
        'active_campaigns': DonationCampaign.objects.filter(is_active=True).count(),
    }
    
    return Response(stats)
