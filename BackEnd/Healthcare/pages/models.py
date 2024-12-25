from django.db import models

# Create your models here.
class User(models.Model):
    id = models.IntegerField
    name = models.CharField