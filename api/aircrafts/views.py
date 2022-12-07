from rest_framework.viewsets import ReadOnlyModelViewSet
from rest_framework.filters import SearchFilter
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Count, Max
from django.utils import timezone
from datetime import timedelta

from api.pagination import CustomPageNumberPagination
from .models import AircraftType, AircraftTypeAccessLog
from .serializers import AircraftTypeSerializer


class AircraftTypeViewSet(ReadOnlyModelViewSet):
    serializer_class = AircraftTypeSerializer
    queryset = AircraftType.objects.all().order_by()
    pagination_class = CustomPageNumberPagination
    filter_backends = [SearchFilter]
    search_fields = ['code', 'fullname', 'reference__wake_cat', 'manufacturer']

    def get_queryset(self):
        return AircraftType.objects\
            .annotate(access_count=Count('access_logs'))\
            .annotate(last_access=Max('access_logs__date'))\
            .order_by('-access_count', '-last_access')

    def get_object(self):
        obj = super().get_object()
        obj.clean_logs()
        AircraftTypeAccessLog.objects.create(aircraft=obj)
        return obj

    @action(detail=False, methods=['get'], name="List of most searched aircrafts")
    def most_searched(self, request):
        queryset = self.get_queryset().filter(access_count__gt=0)[:5]
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
