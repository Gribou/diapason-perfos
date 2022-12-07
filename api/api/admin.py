from django.http import HttpResponseRedirect
from django.http.response import HttpResponse
from django.urls import reverse_lazy, path
from django.utils.safestring import mark_safe
from django.core.files.storage import default_storage
from django import forms
from django.contrib import admin
import json


class ExtraButtonsMixin:
    change_list_template = "api/admin/admin_list_with_extra_buttons.html"

    def get_extra_buttons(self):
        # should return action as { title, path, method }
        raise NotImplemented

    def get_urls(self):
        urls = super().get_urls()
        extra_urls = [path(extra['path'], extra['method'])
                      for extra in self.get_extra_buttons()]
        return extra_urls + urls

    def changelist_view(self, request, extra_context=None):
        extra_context = extra_context or {}
        extra_context['extra_buttons'] = self.get_extra_buttons()
        return super().changelist_view(request, extra_context=extra_context)

    def trigger_task(self, request, task):
        result = task.delay()
        self.message_user(
            request,
            mark_safe("<a href='{}'>Tâche {} ajoutée à la file</a> ({})".format(
                reverse_lazy('admin:django_celery_results_taskresult_changelist'), result.task_id, result.status))
        )
        return HttpResponseRedirect("../")


class FileImportForm(forms.Form):
    file = forms.FileField(label='Fichier')


def trigger_task_with_uploaded_file(admin, request, task):
    uploaded_file = request.FILES['file']
    file_name = default_storage.save(
        uploaded_file.name, uploaded_file)
    result = task.delay(file_name)
    admin.message_user(
        request,
        mark_safe("<a href='{}'>Tâche {} ajoutée à la file</a> ({})".format(reverse_lazy(
            'admin:django_celery_results_taskresult_changelist'), result.task_id, result.status))
    )
    return HttpResponseRedirect("../")


def export_as_json(request, queryset, model, serializer_class):
    data = serializer_class(
        queryset, many=True, context={'request': request}).data
    response = HttpResponse(json.dumps(data))
    response['Content-Disposition'] = 'attachment; filename={}.json'.format(
        model._meta)
    return response


try:
    from app.version import __version__
    admin.site.site_header = mark_safe("Diapason Perfos Admin <span style='font-size:0.8125rem;'>({})</span>".format(
        __version__))
except:
    admin.site.site_header = "Diapason Perfos Admin"
