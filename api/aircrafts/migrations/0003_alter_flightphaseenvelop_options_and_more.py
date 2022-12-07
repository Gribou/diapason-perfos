# Generated by Django 4.0.5 on 2022-06-09 12:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('aircrafts', '0002_flightphaseenvelop_high_altitude_rocd_and_more'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='flightphaseenvelop',
            options={'ordering': ['aircraft', 'phase', 'altitude_range'], 'verbose_name': 'Phase de vol', 'verbose_name_plural': 'Phases de vol'},
        ),
        migrations.RemoveField(
            model_name='aircrafttype',
            name='wikipedia_url',
        ),
        migrations.RemoveField(
            model_name='flightphaseenvelop',
            name='high_altitude_rocd',
        ),
        migrations.RemoveField(
            model_name='flightphaseenvelop',
            name='high_altitude_speed',
        ),
        migrations.RemoveField(
            model_name='flightphaseenvelop',
            name='low_altitude_rocd',
        ),
        migrations.RemoveField(
            model_name='flightphaseenvelop',
            name='low_altitude_speed',
        ),
        migrations.RemoveField(
            model_name='flightphaseenvelop',
            name='mach_number',
        ),
        migrations.RemoveField(
            model_name='flightphaseenvelop',
            name='mach_rocd',
        ),
        migrations.RemoveField(
            model_name='referenceaircrafttype',
            name='performance_parameters',
        ),
        migrations.AddField(
            model_name='aircrafttype',
            name='manufacturer',
            field=models.CharField(blank=True, max_length=50, null=True, verbose_name='Fabricant'),
        ),
        migrations.AddField(
            model_name='aircrafttype',
            name='version',
            field=models.CharField(blank=True, max_length=25, null=True, verbose_name='Version'),
        ),
        migrations.AddField(
            model_name='flightphaseenvelop',
            name='altitude_range',
            field=models.CharField(choices=[('LOW', 'Basse altitude'), ('MEDIUM', 'Moyenne altitude'), ('HIGH', 'Haute altitude')], default='MEDIUM', max_length=7, verbose_name="Plage d'altitude"),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='flightphaseenvelop',
            name='max_mach',
            field=models.DecimalField(blank=True, decimal_places=2, default=0, max_digits=3, null=True, verbose_name='Mach maxi'),
        ),
        migrations.AddField(
            model_name='flightphaseenvelop',
            name='max_rocd',
            field=models.IntegerField(default=0, verbose_name='ROCD maxi (ft/min)'),
        ),
        migrations.AddField(
            model_name='flightphaseenvelop',
            name='max_speed',
            field=models.PositiveIntegerField(blank=True, default=0, null=True, verbose_name='Vitesse maxi (kt)'),
        ),
        migrations.AddField(
            model_name='flightphaseenvelop',
            name='min_mach',
            field=models.DecimalField(blank=True, decimal_places=2, default=0, max_digits=3, null=True, verbose_name='Mach mini'),
        ),
        migrations.AddField(
            model_name='flightphaseenvelop',
            name='min_rocd',
            field=models.IntegerField(default=0, verbose_name='ROCD mini (ft/min)'),
        ),
        migrations.AddField(
            model_name='flightphaseenvelop',
            name='min_speed',
            field=models.PositiveIntegerField(blank=True, default=0, null=True, verbose_name='Vitesse mini (kt)'),
        ),
        migrations.AddField(
            model_name='referenceaircrafttype',
            name='landing_length',
            field=models.PositiveBigIntegerField(default=0, verbose_name="Distance d'atterrisage"),
        ),
        migrations.AddField(
            model_name='referenceaircrafttype',
            name='last_update',
            field=models.DateTimeField(auto_now=True, verbose_name='Mise à jour'),
        ),
        migrations.AddField(
            model_name='referenceaircrafttype',
            name='version',
            field=models.CharField(blank=True, max_length=25, null=True, verbose_name='Version'),
        ),
        migrations.AddField(
            model_name='referenceaircrafttype',
            name='wing_span',
            field=models.DecimalField(decimal_places=1, default=0, max_digits=3, verbose_name='Envergure'),
        ),
    ]
