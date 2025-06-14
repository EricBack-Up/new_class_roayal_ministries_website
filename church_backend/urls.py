"""
URL configuration for New Class Royal Ministries website.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

urlpatterns = [
    # Admin
    path('admin/', admin.site.urls),
    
    # API Documentation
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    
    # Authentication
    path('api/auth/', include('apps.members.urls')),
    
    # Core API endpoints
    path('api/sermons/', include('apps.sermons.urls')),
    path('api/events/', include('apps.events.urls')),
    path('api/donations/', include('apps.donations.urls')),
    path('api/prayer/', include('apps.prayer.urls')),
    path('api/newsletter/', include('apps.newsletter.urls')),
    path('api/livestream/', include('apps.livestream.urls')),
    path('api/core/', include('apps.core.urls')),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    
    # Debug toolbar
    if 'debug_toolbar' in settings.INSTALLED_APPS:
        import debug_toolbar
        urlpatterns = [
            path('__debug__/', include(debug_toolbar.urls)),
        ] + urlpatterns

# Customize admin site
admin.site.site_header = "New Class Royal Ministries Admin"
admin.site.site_title = "Church Admin"
admin.site.index_title = "Welcome to Church Administration"
