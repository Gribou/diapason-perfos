from django.test import TestCase
from time import sleep

from aircrafts.models import ReferenceAircraftType, AircraftType
from sourceforme.tasks import get_last_version_in_db
from sourceforme.parsers import parse_aircraft, parse_reference, parse_rocd

# FIXME mock 4Me API


class Source4MeTestCase(TestCase):

    def test_last_version_in_db(self):
        ReferenceAircraftType.objects.create(version="first_version")
        sleep(1)  # so that timestamp is different
        ReferenceAircraftType.objects.create(version="second_version")
        self.assertEqual(get_last_version_in_db(), "second_version")

    def test_aircraft_parser(self):
        parse_aircraft(AIRCRAFT_API_DATA, "version")
        ref = ReferenceAircraftType.objects.filter(code="AN30")
        air = AircraftType.objects.get(code="AN26")
        self.assertTrue(ref.exists())
        self.assertEqual(air.manufacturer, "ANTONOV")
        self.assertEqual(air.fullname, "An-26")
        self.assertEqual(air.reference.code, "AN30")

    def test_reference_parser(self):
        ref = ReferenceAircraftType.objects.create(code="A320")
        parse_reference(REFERENCE_API_DATA, ref)
        ref.refresh_from_db()
        self.assertEqual(ref.engine_type, "JET")
        self.assertEqual(ref.number_of_engines, 2)
        self.assertEqual(str(ref.wing_span), "34.1")
        self.assertEqual(str(ref.length), "37.6")
        self.assertEqual(ref.wake_cat, "MEDIUM")
        self.assertEqual(ref.landing_length, 1440)
        self.assertEqual(ref.max_mass, 77000)
        self.assertEqual(ref.max_operating_altitude, 41000)
        self.assertEqual(str(ref.mmo), "0.82")
        self.assertEqual(ref.vmo, 350)
        # low/medium/high * climb/cruise/descent
        self.assertEqual(ref.phases.count(), 9)
        med_climb = ref.phases.get(phase="CLIMB", altitude_range="MEDIUM")
        self.assertEqual(med_climb.min_speed, 310)
        self.assertEqual(med_climb.max_speed, 310)
        high_cruise = ref.phases.get(phase="CRUISE", altitude_range="HIGH")
        self.assertEqual(str(high_cruise.min_mach), "0.78")
        self.assertEqual(str(high_cruise.max_mach), "0.78")

    def test_dynamic_parser(self):
        ref = ReferenceAircraftType.objects.create(code="A320")
        parse_reference(REFERENCE_API_DATA, ref)
        parse_rocd(DYNAMIC_API_DATA, ref)
        ref.refresh_from_db()
        self.assertEqual(ref.transition_altitude, 27779)
        med_climb = ref.phases.get(phase="CLIMB", altitude_range="MEDIUM")
        high_climb = ref.phases.get(phase="CLIMB", altitude_range="HIGH")
        self.assertEqual(med_climb.max_rocd, 4056)
        self.assertEqual(high_climb.max_rocd, 2438)


AIRCRAFT_API_DATA = {
    "icaoId": "AN26",
    "manufacturer": "ANTONOV",
    "model": "An-26",
    "synonym": "AN30"
}
REFERENCE_API_DATA = {"search": {"icaoId": "A320", "model": "A320-231", "manufacturer": "AIRBUS"}, "found": {"icaoId": "A320", "model": "A320-231", "manufacturer": "AIRBUS"}, "staticData": {"acftType": {"icaoId": "A320", "enginesCount": 2, "enginesType": "Jet", "wake": "M"}, "mass": {"reference": 64, "minimum": 39, "maximum": 77, "maxPayload": 21.5}, "ground": {"takeoffLength": 2190, "landingLength": 1440, "wingSpan": 34.1, "length": 37.57}, "flightEnvelope": {"vmo": 350, "mmo": 0.82, "maxAlt": 41000, "Hmax": 33295}, "procedures": {"climb": {"lowMass": {"lowAlt": {"cas": 310}, "highAlt": {"cas": 310, "mach": 0.78}}, "medMass": {
    "lowAlt": {"cas": 310}, "highAlt": {"cas": 310, "mach": 0.78}}, "highMass": {"lowAlt": {"cas": 310}, "highAlt": {"cas": 310, "mach": 0.78}}}, "cruise": {"lowMass": {"lowAlt": {"cas": 250}, "highAlt": {"cas": 310, "mach": 0.78}}, "medMass": {"lowAlt": {"cas": 250}, "highAlt": {"cas": 310, "mach": 0.78}}, "highMass": {"lowAlt": {"cas": 250}, "highAlt": {"cas": 310, "mach": 0.78}}}, "descent": {"lowMass": {"lowAlt": {"cas": 300}, "highAlt": {"cas": 300, "mach": 0.79}}, "medMass": {"lowAlt": {"cas": 300}, "highAlt": {"cas": 300, "mach": 0.79}}, "highMass": {"lowAlt": {"cas": 300}, "highAlt": {"cas": 300, "mach": 0.79}}}}}}
DYNAMIC_API_DATA = [
    {"search": {"icaoId": "A320", "model": "A320-231", "manufacturer": "AIRBUS"}, "found": {"icaoId": "A320", "model": "A320-231", "manufacturer": "AIRBUS"}, "dynamicData": [{"fl": 100, "maxAltitude": 41000, "temperature": 268, "pressure": 69682, "trueAirSpeed": 357, "calibratedAirSpeed": 310, "machNumber": 56, "transitionAltitude": 27779, "mass": 46600, "maxRateOfClimb": 4609, "reducedRateOfClimb": 4056}, {"fl": 110, "maxAltitude": 41000, "temperature": 266, "pressure": 67020, "trueAirSpeed": 362, "calibratedAirSpeed": 310, "machNumber": 57, "transitionAltitude": 27779, "mass": 46600, "maxRateOfClimb": 4484, "reducedRateOfClimb": 3946}, {"fl": 150, "maxAltitude": 41000, "temperature": 258, "pressure": 57182, "trueAirSpeed": 383, "calibratedAirSpeed": 310, "machNumber": 61, "transitionAltitude": 27779, "mass": 46600, "maxRateOfClimb": 3965, "reducedRateOfClimb": 3489}, {"fl": 200, "maxAltitude": 41000, "temperature": 249, "pressure": 46563, "trueAirSpeed": 413, "calibratedAirSpeed": 310, "machNumber": 67, "transitionAltitude": 27779, "mass": 46600, "maxRateOfClimb": 3278, "reducedRateOfClimb": 2885}, {
        "fl": 250, "maxAltitude": 41000, "temperature": 239, "pressure": 37601, "trueAirSpeed": 445, "calibratedAirSpeed": 310, "machNumber": 74, "transitionAltitude": 27779, "mass": 46600, "maxRateOfClimb": 2554, "reducedRateOfClimb": 2247}, {"fl": 300, "maxAltitude": 41000, "temperature": 229, "pressure": 30090, "trueAirSpeed": 460, "calibratedAirSpeed": 296, "machNumber": 78, "transitionAltitude": 27779, "mass": 46600, "maxRateOfClimb": 2770, "reducedRateOfClimb": 2438}, {"fl": 350, "maxAltitude": 41000, "temperature": 219, "pressure": 23842, "trueAirSpeed": 450, "calibratedAirSpeed": 264, "machNumber": 78, "transitionAltitude": 27779, "mass": 46600, "maxRateOfClimb": 2149, "reducedRateOfClimb": 1891}, {"fl": 400, "maxAltitude": 41000, "temperature": 217, "pressure": 18754, "trueAirSpeed": 447, "calibratedAirSpeed": 235, "machNumber": 78, "transitionAltitude": 27779, "mass": 46600, "maxRateOfClimb": 1308, "reducedRateOfClimb": 1151}, {"fl": 410, "maxAltitude": 41000, "temperature": 217, "pressure": 17874, "trueAirSpeed": 447, "calibratedAirSpeed": 230, "machNumber": 78, "transitionAltitude": 27779, "mass": 46600, "maxRateOfClimb": 1159, "reducedRateOfClimb": 1020}]},
    {"search": {"icaoId": "A320", "model": "A320-231", "manufacturer": "AIRBUS"}, "found": {"icaoId": "A320", "model": "A320-231", "manufacturer": "AIRBUS"}, "dynamicData": [{"fl": 100, "maxAltitude": 39761, "temperature": 268, "pressure": 69682, "trueAirSpeed": 357, "calibratedAirSpeed": 310, "machNumber": 56, "transitionAltitude": 27779, "mass": 69400, "maxRateOfClimb": 2821, "reducedRateOfClimb": 2736}, {"fl": 150, "maxAltitude": 39761, "temperature": 258, "pressure": 57182, "trueAirSpeed": 383, "calibratedAirSpeed": 310, "machNumber": 61, "transitionAltitude": 27779, "mass": 69400, "maxRateOfClimb": 2370, "reducedRateOfClimb": 2299}, {"fl": 200, "maxAltitude": 39761, "temperature": 249, "pressure": 46563, "trueAirSpeed": 413, "calibratedAirSpeed": 310, "machNumber": 67, "transitionAltitude": 27779, "mass": 69400, "maxRateOfClimb": 1890, "reducedRateOfClimb": 1833}, {
        "fl": 250, "maxAltitude": 39761, "temperature": 239, "pressure": 37601, "trueAirSpeed": 445, "calibratedAirSpeed": 310, "machNumber": 74, "transitionAltitude": 27779, "mass": 69400, "maxRateOfClimb": 1382, "reducedRateOfClimb": 1341}, {"fl": 300, "maxAltitude": 39761, "temperature": 229, "pressure": 30090, "trueAirSpeed": 460, "calibratedAirSpeed": 296, "machNumber": 78, "transitionAltitude": 27779, "mass": 69400, "maxRateOfClimb": 1330, "reducedRateOfClimb": 1290}, {"fl": 350, "maxAltitude": 39761, "temperature": 219, "pressure": 23842, "trueAirSpeed": 450, "calibratedAirSpeed": 264, "machNumber": 78, "transitionAltitude": 27779, "mass": 69400, "maxRateOfClimb": 789, "reducedRateOfClimb": 765}, {"fl": 400, "maxAltitude": 39761, "temperature": 217, "pressure": 18754, "trueAirSpeed": 447, "calibratedAirSpeed": 235, "machNumber": 78, "transitionAltitude": 27779, "mass": 69400, "maxRateOfClimb": 117, "reducedRateOfClimb": 114}]}
]
