
from celery import shared_task
from django.apps import apps
from django.core.files.storage import default_storage
from zipfile import ZipFile
import os
import json

from .models import ENGINE_TYPES, WAKE_CAT


# DO NOT import models here (else circular dependency)

def _get_aircraft_model():
    return apps.get_model(app_label="aircrafts", model_name="AircraftType")


def _get_reference_model():
    return apps.get_model(app_label="aircrafts", model_name="ReferenceAircraftType")


def _get_phase_model():
    return apps.get_model(app_label="aircrafts", model_name="FlightPhaseEnvelop")


@shared_task
def import_pictures(uploaded_file_name):
    # this task should be triggered after creating aircraft types with import_bada
    AircraftType = _get_aircraft_model()
    try:
        file_path = default_storage.path(uploaded_file_name)
        with ZipFile(file_path, 'r') as zip:
            for filepath in zip.namelist():
                filename = os.path.basename(filepath)
                aircraft_type = filename.split(".")[0]
                if aircraft_type:
                    # do not create a new type if it does not already exist
                    aircraft = AircraftType.objects.filter(
                        code=aircraft_type).first()
                    if aircraft:
                        with zip.open(filepath) as file:
                            file_path = os.path.join("pictures", filename)
                            # deletes existing if exists
                            if os.path.isfile(file_path):
                                default_storage.delete(file_path)
                            default_storage.save(file_path, file)
                            aircraft.picture = file_path
                            aircraft.save()
    finally:
        default_storage.delete(uploaded_file_name)


@shared_task
def import_aircraft_from_json(uploaded_file_name):
    AircraftType = _get_aircraft_model()
    ReferenceAircraftType = _get_reference_model()
    try:
        with default_storage.open(uploaded_file_name) as f:
            data = json.load(f)
            count = len(data)
            for obj in data:
                r, _ = ReferenceAircraftType.objects.get_or_create(
                    code=obj['reference']["code"])
                a, _ = AircraftType.objects.get_or_create(
                    code=obj["code"], defaults={'reference': r})
                for attr, value in obj.items():
                    if attr in ['fullname', 'manufacturer',                'picture']:
                        setattr(a, attr, value)
                a.reference = r
                print(a.code)
                a.save()
            print("{} objets importés".format(count))
    finally:
        default_storage.delete(uploaded_file_name)


@shared_task
def import_reference_from_json(uploaded_file_name):
    ReferenceAircraftType = _get_reference_model()
    FlightPhaseEnvelop = _get_phase_model()
    try:
        with default_storage.open(uploaded_file_name) as f:
            data = json.load(f)
            count = len(data)
            for obj in data:
                r, _ = ReferenceAircraftType.objects.get_or_create(
                    code=obj['code'])
                for attr, value in obj.items():
                    if attr in ['number_of_engines', 'wing_span', 'landing_length', 'max_mass', 'max_operating_altitude', 'mmo', 'vmo', 'engine_type', 'wake_cat']:
                        setattr(r, attr, value)
                r.engine_type = [i[0]
                                 for i in ENGINE_TYPES if i[1] == obj['engine_type']][0]
                r.wake_cat = [i[0]
                              for i in WAKE_CAT if i[1] == obj['wake_cat']][0]
                r.save()
                r.phases.all().delete()
                for phase in obj['phases']:
                    FlightPhaseEnvelop.objects.create(aircraft=r, **phase)
                print(r.code)
            print("{} objets importés".format(count))
    finally:
        default_storage.delete(uploaded_file_name)
