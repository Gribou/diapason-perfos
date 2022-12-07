# Generated by Django 4.0.5 on 2022-06-15 14:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('aircrafts', '0004_alter_aircrafttype_version_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='aircrafttype',
            name='access_counter',
            field=models.PositiveIntegerField(default=0, verbose_name="Nombre d'accès"),
        ),
        migrations.AddField(
            model_name='aircrafttype',
            name='last_access',
            field=models.DateTimeField(blank=True, null=True, verbose_name='Accès le plus récent'),
        ),
    ]