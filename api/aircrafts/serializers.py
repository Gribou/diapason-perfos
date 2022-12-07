from rest_framework import serializers
from django.urls import reverse

from .models import FlightPhaseEnvelop, ReferenceAircraftType, AircraftType


class FlightPhaseEnvelopSerializer(serializers.ModelSerializer):

    class Meta:
        model = FlightPhaseEnvelop
        fields = ['phase', 'altitude_range', 'min_speed', 'max_speed',
                  'min_mach', 'max_mach', 'min_rocd', 'max_rocd']


class ReferenceAircraftTypeSerializer(serializers.ModelSerializer):
    phases = FlightPhaseEnvelopSerializer(many=True)
    engine_type = serializers.CharField(source='get_engine_type_display')
    wake_cat = serializers.CharField(source='get_wake_cat_display')

    class Meta:
        model = ReferenceAircraftType
        fields = [
            'code', 'engine_type', 'number_of_engines', 'wing_span', 'length',
            'wake_cat', 'landing_length', 'max_mass', 'max_operating_altitude', 'mmo', 'vmo', 'phases', 'transition_altitude', 'pk', 'last_update']


class AircraftTypeSerializer(serializers.ModelSerializer):
    reference = ReferenceAircraftTypeSerializer()
    global_search = serializers.SerializerMethodField()

    class Meta:
        model = AircraftType
        fields = ['pk', 'code', 'fullname', 'manufacturer',
                  'picture', 'reference', 'global_search']

    def get_global_search(self, obj):
        # pre-formatted attr to be used by global search feature (diapason-portal)
        index_url = self.context['request'].build_absolute_uri(
            reverse("home"))
        return {
            "title": obj.code,
            "subtitle": "{} {}".format(obj.manufacturer, obj.fullname),
            "url": "{}aircraft/{}".format(index_url, obj.pk)
        }
