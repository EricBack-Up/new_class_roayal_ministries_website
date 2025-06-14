"""
Filters for sermons app.
"""
import django_filters
from .models import Sermon, SermonSeries
from apps.core.models import Staff


class SermonFilter(django_filters.FilterSet):
    """
    Filter for sermons with various criteria.
    """
    preacher = django_filters.ModelChoiceFilter(queryset=Staff.objects.filter(is_active=True))
    series = django_filters.ModelChoiceFilter(queryset=SermonSeries.objects.filter(is_active=True))
    date_from = django_filters.DateFilter(field_name='date_preached', lookup_expr='gte')
    date_to = django_filters.DateFilter(field_name='date_preached', lookup_expr='lte')
    has_audio = django_filters.BooleanFilter(method='filter_has_audio')
    has_video = django_filters.BooleanFilter(method='filter_has_video')
    tags = django_filters.CharFilter(method='filter_by_tags')
    
    class Meta:
        model = Sermon
        fields = ['preacher', 'series', 'is_featured']
    
    def filter_has_audio(self, queryset, name, value):
        if value:
            return queryset.exclude(audio_file='')
        return queryset.filter(audio_file='')
    
    def filter_has_video(self, queryset, name, value):
        from django.db import models
        if value:
            return queryset.filter(
                models.Q(video_file__isnull=False) |
                models.Q(video_url__isnull=False)
            ).exclude(video_file='').exclude(video_url='')
        return queryset.filter(video_file='', video_url='')
    
    def filter_by_tags(self, queryset, name, value):
        tag_list = [tag.strip() for tag in value.split(',')]
        return queryset.filter(tags__name__in=tag_list).distinct()
