from rest_framework import serializers

class SymptomsSerializer(serializers.Serializer):
    symptoms = serializers.ListField(child=serializers.CharField())
