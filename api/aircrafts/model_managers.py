from django.db import models

'''
When using many to many fields, SQL queries tend to proliferate when
iterating through a queryset
(because a new query is sent to m2m table for each item).
This can be prevented by prefetching children before iterating
'''


class PrefetchingAircraftManager(models.Manager):

    def get_queryset(self):
        return super().get_queryset()\
            .select_related('reference').prefetch_related('reference__phases', 'access_logs')
