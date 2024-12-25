from django.db import models


class Symptoms(models.Model):
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Symptom: {self.description[:50]}" if self.description else "Symptom: [No description]"

    class Meta:
        verbose_name = 'Symptom'
        verbose_name_plural = 'Symptoms'
