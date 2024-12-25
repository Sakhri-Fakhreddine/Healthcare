from django.db import models
import json

class Diagnosis(models.Model):
    user = models.ForeignKey(
        'users.User',  # Reference the User model
        on_delete=models.CASCADE,
        related_name='diagnoses'
    )
    diagnosis_date = models.DateField()
    diagnosis_description = models.TextField(blank=True, null=True)
    diagnosis_confidence= models.FloatField(blank=True, null=True)
    # Symptoms as a list of strings (stored as a JSON-encoded string)
    entered_symptoms = models.TextField(blank=True, null=True)  # Will store list of strings as JSON
    
    recommandation = models.OneToOneField(
        'Recommandation.Recommandation',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='related_diagnosis'
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    review = models.BooleanField(default=False)

    def get_symptoms_list(self):
        """Return the symptoms as a list of strings."""
        if self.entered_symptoms:
            return json.loads(self.entered_symptoms)  # Convert the JSON string back to a list
        return []

    def __str__(self):
        return f"Diagnosis for {self.user} on {self.diagnosis_date}"

    class Meta:
        verbose_name = 'Diagnosis'
        verbose_name_plural = 'Diagnoses'
