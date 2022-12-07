from django.apps import AppConfig
from constance.apps import ConstanceConfig
from django_celery_results.apps import CeleryResultConfig
from django_celery_beat.apps import BeatConfig


class ApiConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'api'
    verbose_name = "Données BADA"


CeleryResultConfig.verbose_name = "Tâches - Résultats"
ConstanceConfig.verbose_name = "Paramètres"
BeatConfig.verbose_name = "Tâches - Planification"
