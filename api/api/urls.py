from django.urls import path, include

from .views import HealthCheckView, ContactFormView, ConfigView

urlpatterns = [
    path('aircrafts/', include('aircrafts.urls')),
    path('contact/', ContactFormView.as_view(), name="api-contact"),
    path('config/', ConfigView.as_view(), name="api-config"),
    path('health/', HealthCheckView.as_view(),
         name="api-health"),
]
