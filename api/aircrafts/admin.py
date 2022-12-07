from django.contrib import admin
from django.shortcuts import render
from django.utils.html import format_html
from django.urls import reverse_lazy
from django.utils.safestring import mark_safe
from django.http import HttpResponseRedirect

from api.admin import ExtraButtonsMixin, export_as_json, trigger_task_with_uploaded_file, FileImportForm
from sourceforme.tasks import update_with_4me
from .tasks import import_pictures, import_aircraft_from_json, import_reference_from_json
from .models import ReferenceAircraftType, AircraftType, FlightPhaseEnvelop
from .serializers import AircraftTypeSerializer, ReferenceAircraftTypeSerializer


class FlightPhaseInline(admin.TabularInline):
    model = FlightPhaseEnvelop


@admin.register(ReferenceAircraftType)
class ReferenceAircraftTypeAdmin(ExtraButtonsMixin, admin.ModelAdmin):
    model = ReferenceAircraftType
    list_display = ['code', 'engine_type',
                    'number_of_engines', 'wake_cat', 'last_update']
    inlines = [FlightPhaseInline, ]
    actions = ['_export_as_json']
    readonly_fields = ['version']
    list_filter = ("wake_cat", "engine_type", "version")

    def _export_as_json(self, request, queryset):
        return export_as_json(request, queryset, self.model, ReferenceAircraftTypeSerializer)
    _export_as_json.short_description = "Exporter au format JSON"

    def get_extra_buttons(self):
        return [{
            'title': 'Import JSON',
            'path': 'import-json/',
            'method': self.import_json
        }]

    def import_json(self, request):
        if request.method == "POST" and request.FILES:
            return trigger_task_with_uploaded_file(self, request, import_reference_from_json)
        return render(
            request, "api/admin/import_file_form.html", {
                "form": FileImportForm(),
                "message": "Importer ici un fichier JSON généré avec l'option 'Exporter au format JSON' de cette application"}
        )


@admin.register(AircraftType)
class AircraftTypeAdmin(ExtraButtonsMixin, admin.ModelAdmin):
    model = AircraftType
    list_display = ['code', 'fullname',
                    'reference_link', 'has_picture', 'last_update', 'get_access_counter', 'get_last_access']
    search_fields = ['code', 'fullname',
                     'reference__code', 'reference__wake_cat']
    readonly_fields = ['version']
    list_filter = (
        ("picture", admin.EmptyFieldListFilter),
        "reference__wake_cat", "reference__engine_type",
        "version"
    )
    actions = ['_export_as_json']

    def has_picture(self, obj):
        return bool(obj.picture)
    has_picture.boolean = True
    has_picture.short_description = "Photo"

    def reference_link(self, obj):
        url = reverse_lazy('admin:aircrafts_referenceaircrafttype_change',
                           args=(obj.reference.pk,))
        return format_html("<a href='{}'>{}</a>", url, obj.reference)
    reference_link.admin_order_field = 'reference'
    reference_link.short_description = 'Type de référence'

    def get_access_counter(self, obj):
        return obj.access_logs.count()
    get_access_counter.short_description = 'Accès'

    def get_last_access(self, obj):
        return obj.access_logs.first().date if obj.access_logs.exists() else None
    get_last_access.short_description = 'Dernière accès'

    def get_extra_buttons(self):
        return [{
            'title': 'Update BADA',
            'path': 'update-bada/',
            'method': self.update_bada
        }, {
            'title': 'Import photos',
            'path': "import-zip/",
            'method': self.import_zip
        }, {'title': 'Import JSON', 'path': 'import-json/',
            'method': self.import_json
            }]

    def update_bada(self, request):
        result = update_with_4me.delay()
        self.message_user(
            request,
            mark_safe("<a href='{}'>Tâche {} ajoutée à la file</a> ({})".format(
                reverse_lazy('admin:django_celery_results_taskresult_changelist'), result.task_id, result.status))
        )
        return HttpResponseRedirect("../")

    def import_zip(self, request):
        if request.method == "POST" and request.FILES:
            return trigger_task_with_uploaded_file(self, request, import_pictures)
        return render(
            request, "api/admin/import_file_form.html", {
                "form": FileImportForm(),
                "message": "Importer ici un fichier ZIP contenant les photos nommées en fonction du type avion représenté (ex : A320.jpg, B744.jpg)."}
        )

    def import_json(self, request):
        if request.method == "POST" and request.FILES:
            return trigger_task_with_uploaded_file(self, request, import_aircraft_from_json)
        return render(
            request, "api/admin/import_file_form.html", {
                "form": FileImportForm(),
                "message": "Importer ici un fichier JSON généré avec l'option 'Exporter au format JSON' de cette application"}
        )

    def _export_as_json(self, request, queryset):
        return export_as_json(request, queryset, self.model, AircraftTypeSerializer)
    _export_as_json.short_description = "Exporter au format JSON"
