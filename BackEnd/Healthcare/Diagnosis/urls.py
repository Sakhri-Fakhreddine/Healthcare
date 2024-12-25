from django.urls import path
from .views import MedicalHistoryView, SymptomsDiagnosisView


urlpatterns = [
# path('diagnosis/', SymptomsDiagnosisView.as_view(), name='diagnosis'),
# path('medical-history/<int:id>/', MedicalHistoryView.as_view(), name='medical-history'),
]