from django.db import models
from django.dispatch.dispatcher import receiver
from django.db.models import signals
from django.utils import timezone
from datetime import timedelta
import os

from .model_managers import PrefetchingAircraftManager

ENGINE_TYPES = [
    ('JET', 'Réacteur'),
    ("TURBOPROP", "Turboprop"),
    ("PISTON", "Piston"),
    ("ELECTRIC", "Electrique")
]
WAKE_CAT = [
    ('SUPER', 'Super'),
    ('HEAVY', 'Heavy'),
    ('MEDIUM', 'Medium'),
    ('LIGHT', 'Light')
]
FLIGHT_PHASES = [
    ('CLIMB', 'Montée'),
    ('CRUISE', 'Croisière'),
    ('DESCENT', 'Descente')
]
ALTITUDE_RANGES = [
    ('LOW', 'Basse altitude'),
    ('MEDIUM', 'Moyenne altitude'),
    ('HIGH', 'Haute altitude')
]


class ReferenceAircraftType(models.Model):
    code = models.CharField("Nom de code", max_length=4)
    engine_type = models.CharField(
        "Type de motorisation", max_length=9, choices=ENGINE_TYPES)
    number_of_engines = models.PositiveIntegerField(
        "Nombre de moteurs", default=0)
    wing_span = models.DecimalField(
        "Envergure", max_digits=3, decimal_places=1, default=0)
    length = models.DecimalField(
        "Longueur", max_digits=3, decimal_places=1, default=0)
    wake_cat = models.CharField(
        "Catégorie de turbulence de sillage", max_length=9, choices=WAKE_CAT)
    landing_length = models.PositiveBigIntegerField(
        "Distance d'atterrisage", default=0)
    max_mass = models.PositiveIntegerField('Masse max (kg)', default=0)
    max_operating_altitude = models.PositiveIntegerField(
        "Plafond opérationnel (ft)", default=0)
    transition_altitude = models.PositiveIntegerField(
        "Altitude de transition (ft)", default=0)
    mmo = models.DecimalField("MMO", default=0, max_digits=3, decimal_places=2)
    vmo = models.PositiveIntegerField("VMO (kt)", default=0)
    version = models.CharField(
        "Version", max_length=100, null=True, blank=True)
    last_update = models.DateTimeField("Mise à jour", auto_now=True)

    class Meta:
        verbose_name = "Type avion de référence"
        verbose_name = "Types avion de référence"
        ordering = ['code']

    def __str__(self):
        return self.code


class FlightPhaseEnvelop(models.Model):
    aircraft = models.ForeignKey(
        ReferenceAircraftType, on_delete=models.CASCADE, related_name="phases")
    phase = models.CharField(
        "Phase de vol", choices=FLIGHT_PHASES, max_length=7)
    altitude_range = models.CharField(
        "Plage d'altitude", max_length=7, choices=ALTITUDE_RANGES)
    min_speed = models.PositiveIntegerField(
        "Vitesse mini (kt)", default=0, null=True, blank=True)
    max_speed = models.PositiveIntegerField(
        "Vitesse maxi (kt)", default=0, null=True, blank=True)
    min_mach = models.DecimalField(
        "Mach mini", max_digits=3, decimal_places=2, default=0, null=True, blank=True)
    max_mach = models.DecimalField(
        "Mach maxi", max_digits=3, decimal_places=2, default=0, null=True, blank=True)
    min_rocd = models.IntegerField("ROCD mini (ft/min)", default=0)
    max_rocd = models.IntegerField("ROCD maxi (ft/min)", default=0)

    class Meta:
        verbose_name = "Phase de vol"
        verbose_name_plural = "Phases de vol"
        ordering = ['aircraft', 'phase', 'altitude_range']


class AircraftType(models.Model):
    code = models.CharField("Nom de code", max_length=4)
    reference = models.ForeignKey(ReferenceAircraftType,
                                  on_delete=models.CASCADE,
                                  verbose_name="Type avion de référence", related_name="synonyms")
    picture = models.ImageField(
        "Photo", max_length=251, null=True, blank=True, upload_to="pictures")
    fullname = models.CharField(
        "Nom complet", max_length=250, blank=True, null=True)
    manufacturer = models.CharField(
        "Fabricant", max_length=50, null=True, blank=True)
    version = models.CharField(
        "Version", max_length=100, null=True, blank=True)
    last_update = models.DateTimeField("Mise à jour", auto_now=True)

    class Meta:
        verbose_name = "Type avion"
        verbose_name_plural = "Types avion"
        ordering = ['code']

    objects = PrefetchingAircraftManager()

    def __str__(self):
        return self.code

    def clean_logs(self):
        # delete all logs older than 30 days
        self.access_logs.filter(
            date__lte=timezone.now() - timedelta(days=30)).all().delete()


class AircraftTypeAccessLog(models.Model):
    aircraft = models.ForeignKey(
        AircraftType, on_delete=models.CASCADE, related_name="access_logs")
    date = models.DateTimeField("Date", auto_now_add=True)

    class Meta:
        verbose_name = "Log d'accès"
        verbose_name_plural = "Logs d'accès"
        ordering = ['-date']


@receiver(signals.post_delete, sender=AircraftType, dispatch_uid="delete_type")
def delete_file_on_doc_delete(sender, instance, **kwargs):
    ''' delete media file on doc delete'''
    if instance.picture:
        if os.path.isfile(instance.picture.path):
            os.remove(instance.picture.path)


@receiver(signals.pre_save, sender=AircraftType, dispatch_uid="update_type")
def delete_old_file_on_doc_update(sender, instance, **kwargs):
    '''delete previous file if it is being updated'''
    if not instance.pk:
        return False
    try:
        old_file = sender.objects.get(pk=instance.pk).picture
    except sender.DoesNotExist:
        return False

    new_file = instance.picture

    if old_file and not old_file == new_file and os.path.isfile(old_file.path):
        os.remove(old_file.path)
