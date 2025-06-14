"""
Serializers for newsletter app.
"""
from rest_framework import serializers
from .models import NewsletterSubscriber


class NewsletterSubscriberSerializer(serializers.ModelSerializer):
    """
    Serializer for newsletter subscribers.
    """
    full_name = serializers.ReadOnlyField()
    
    class Meta:
        model = NewsletterSubscriber
        fields = [
            'id', 'email', 'name', 'first_name', 'last_name', 'full_name',
            'is_active', 'is_confirmed', 'frequency', 'subscribed_at'
        ]
        read_only_fields = ['is_confirmed', 'subscribed_at']


class NewsletterSubscribeSerializer(serializers.ModelSerializer):
    """
    Serializer for newsletter subscription.
    """
    class Meta:
        model = NewsletterSubscriber
        fields = ['email', 'name', 'first_name', 'last_name', 'frequency']
    
    def validate_email(self, value):
        # Check if email is already subscribed and active
        if NewsletterSubscriber.objects.filter(email=value, is_active=True).exists():
            raise serializers.ValidationError("This email is already subscribed to our newsletter.")
        return value
    
    def create(self, validated_data):
        # Check if subscriber exists but is inactive
        try:
            subscriber = NewsletterSubscriber.objects.get(email=validated_data['email'])
            # Reactivate existing subscriber
            for key, value in validated_data.items():
                setattr(subscriber, key, value)
            subscriber.is_active = True
            subscriber.is_confirmed = False  # Require re-confirmation
            subscriber.save()
            return subscriber
        except NewsletterSubscriber.DoesNotExist:
            # Create new subscriber
            return super().create(validated_data)


class NewsletterUnsubscribeSerializer(serializers.Serializer):
    """
    Serializer for newsletter unsubscription.
    """
    email = serializers.EmailField()
    
    def validate_email(self, value):
        try:
            subscriber = NewsletterSubscriber.objects.get(email=value, is_active=True)
            self.subscriber = subscriber
        except NewsletterSubscriber.DoesNotExist:
            raise serializers.ValidationError("This email is not subscribed to our newsletter.")
        return value
    
    def save(self):
        self.subscriber.is_active = False
        self.subscriber.unsubscribed_at = timezone.now()
        self.subscriber.save()
        return self.subscriber
