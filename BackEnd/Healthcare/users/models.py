from django.db import models
from django.contrib.auth.models import AbstractUser


#user model 
class User(AbstractUser):
    ROLE_CHOICES = [
        ('doctor', 'Doctor'),
        ('patient', 'Patient'),
    ]
    
    name = models.CharField(max_length=255)
    gender = models.CharField(max_length=10, choices=[('male', 'Male'), ('female', 'Female')], blank=True)
    email = models.EmailField(max_length=255, unique=True)
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    age = models.PositiveIntegerField(null=True, blank=True)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='patient')  # Rôle par défaut
    username = models.CharField(max_length=255)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

#doctor model 
class Doctor(User):
    specialization = models.CharField(max_length=255)  # Spécialisation du médecin
    license_number = models.CharField(max_length=50, unique=True)  # Numéro de licence du médecin

    def __str__(self):
        return f"{self.name} - {self.specialization}"

#patient model
class Patient(User):
    medical_history = models.TextField(blank=True, null=True)
    date_of_birth = models.DateField(null=True, blank=True)
    # diagnosis_history = models.ManyToManyField(
    #     'diagnosis.Diagnosis',  # Use the app label and model name as a string
    #     blank=True,
    #     related_name='patients'
    # )

    def __str__(self):
        return self.name