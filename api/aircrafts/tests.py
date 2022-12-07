from rest_framework import status

from api.tests.base import *
from .views import AircraftTypeViewSet
from .models import AircraftType, ReferenceAircraftType


class AircraftApiTestCase(ApiTestCase):

    def setUp(self):
        super().setUp()
        ref = ReferenceAircraftType.objects.create(code="REF")
        AircraftType.objects.create(code="REF", reference=ref)
        self.aircraft = AircraftType.objects.create(
            code="AV1", reference=ref, manufacturer="refref")
        ref2 = ReferenceAircraftType.objects.create(code="AV2")
        AircraftType.objects.create(code="AV2", reference=ref2)

    def test_search_list(self):
        request = self.factory.get("/api/aircrafts/", {"search": "REF"})
        response = AircraftTypeViewSet.as_view({"get": "list"})(request)
        self.assertTrue(status.is_success(response.status_code))
        self.assertEqual(response.data['count'], 2)
        codes = [a['code'] for a in response.data['results']]
        self.assertIn("REF", codes)
        self.assertIn("AV1", codes)

    def test_get_by_pk(self):
        request = self.factory.get(
            "/api/aircrafts/{}".format(self.aircraft.pk))
        response = AircraftTypeViewSet.as_view(
            {"get": "retrieve"})(request, pk=self.aircraft.pk)
        self.assertTrue(status.is_success(response.status_code))
        self.assertEqual(response.data['code'], 'AV1')
        self.assertEqual(response.data['manufacturer'], "refref")
        self.assertEqual(response.data['reference']['code'], "REF")
        self.aircraft.refresh_from_db()
        self.assertTrue(self.aircraft.access_logs.exists())

    def test_most_searched(self):
        request = self.factory.get("/api/aircrafts/most_searched/")
        response = AircraftTypeViewSet.as_view(
            {"get": "most_searched"})(request)
        self.assertTrue(status.is_success(response.status_code))
        self.assertEqual(len(response.data), 0)
        # access to an aircraft then try again
        request = self.factory.get(
            "/api/aircrafts/{}".format(self.aircraft.pk))
        AircraftTypeViewSet.as_view(
            {"get": "retrieve"})(request, pk=self.aircraft.pk)
        response = AircraftTypeViewSet.as_view(
            {"get": "most_searched"})(request)
        self.assertTrue(status.is_success(response.status_code))
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['code'], "AV1")
