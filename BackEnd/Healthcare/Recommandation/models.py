from django.db import models
from Diagnosis.models import Diagnosis  # Import the Diagnosis model

class Recommandation(models.Model):
    diagnosis = models.ForeignKey(Diagnosis, on_delete=models.CASCADE, related_name='recommendations',default=1)
    details = models.TextField(blank=True, null=True)  # List of recommendations
    doctor_comment = models.TextField(blank=True, null=True)  # Doctor's comment on the recommendation
    recommendation_notes = models.TextField(blank=True, null=True)  # Any additional notes

    def __str__(self):
        return f"Recommandation for Diagnosis {self.diagnosis.id}: {self.recommendation_notes[:50]}" if self.recommendation_notes else f"Recommandation for Diagnosis {self.diagnosis.id}: [No Notes]"

    class Meta:
        verbose_name = 'Recommandation'
        verbose_name_plural = 'Recommandations'
