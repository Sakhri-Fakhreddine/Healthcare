from rest_framework import serializers
from .models import User, Doctor, Patient

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id','email', 'password', 'name', 'gender', 'phone_number', 'age', 'role']
        extra_kwargs = {
            'password': {'write_only': True},
            'role': {'read_only': True},  # Le rôle est défini par défaut
        }

    def create(self, validated_data):
        user = User(
            email=validated_data['email'],
            name=validated_data['name'],
            gender=validated_data.get('gender'),
            phone_number=validated_data.get('phone_number'),
            age=validated_data.get('age'),
            role='patient'  # Rôle par défaut
        )
        user.set_password(validated_data['password'])  # Utiliser la méthode set_password pour hacher le mot de passe
        user.save()
        return user

class DoctorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Doctor
        fields = ['id', 'email', 'name', 'gender', 'phone_number', 'age', 'role', 'specialization', 'license_number']
        extra_kwargs = {
            'role': {'read_only': True},  # Rôle est défini dans le modèle
        }

class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = ['id', 'email', 'name', 'gender', 'phone_number', 'age', 'role', 'medical_history', 'date_of_birth']
        extra_kwargs = {
            'role': {'read_only': True},  # Rôle est défini dans le modèle
        }
def update(self, instance, validated_data):
        # Handle password separately if provided
        password = validated_data.pop('password', None)
        if password:
            instance.set_password(password)  # If a new password is provided, set it

        # Update other fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance