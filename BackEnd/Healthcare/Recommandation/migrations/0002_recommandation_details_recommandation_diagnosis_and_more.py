# Generated by Django 5.1.3 on 2024-12-14 05:57

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Diagnosis', '0003_rename_duagnosis_confidence_diagnosis_diagnosis_confidence'),
        ('Recommandation', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='recommandation',
            name='details',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='recommandation',
            name='diagnosis',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, related_name='recommendations', to='Diagnosis.diagnosis'),
        ),
        migrations.AddField(
            model_name='recommandation',
            name='doctor_comment',
            field=models.TextField(blank=True, null=True),
        ),
    ]
