from django.core.management.base import BaseCommand

from sourceforme.tasks import update_with_4me


class Command(BaseCommand):
    help = "Télécharge les données du dernier cycle AIRAC depuis l'eAIP (sia.aviation-civile.gouv.fr)"

    def add_arguments(self, parser):
        parser.add_argument(
            '-f', '--force',
            action='store_true',
            help='Télécharge les données même s\'il y en a déjà pour ce cycle AIRAC en base de données',
        )

    def handle(self, *args, **kwargs):
        force = kwargs['force']
        update_with_4me(force=force, verbose=True)
