from django.contrib import admin
from .models import User  # Importez votre modèle User

class UserAdmin(admin.ModelAdmin):
    list_display = ('email', 'name', 'gender', 'role', 'is_staff', 'is_superuser')  # Choisissez les champs à afficher dans la liste
    search_fields = ('email', 'name')  # Champs sur lesquels vous pouvez rechercher
    list_filter = ('role', 'is_staff', 'is_superuser')  # Filtres disponibles dans l'interface d'administration

# Enregistrez le modèle User dans l'interface d'administration
admin.site.register(User, UserAdmin)
