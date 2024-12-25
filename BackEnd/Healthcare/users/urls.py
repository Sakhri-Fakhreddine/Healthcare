from django.urls import path

from Recommandation.views import UpdateRecommendationView
from Diagnosis.views import MedicalHistoryView, RecommandationsView, SymptomsDiagnosisView

from .views import DoctorListView, PatientListView, RegisterView ,LoginView,UserView,LogoutView,SigninView
from oauth2_provider.views import TokenView


urlpatterns = [
    path('register', RegisterView.as_view()),
    path('login', LoginView.as_view()),
    path('user', UserView.as_view()),
    path('logout', LogoutView.as_view()),
    path('signin/<str:token>', SigninView.as_view(), name='signin'),
    path('oauth2/token', TokenView.as_view(), name='token'),
    path('diagnosis/', SymptomsDiagnosisView.as_view(), name='diagnosis'),
    path('medical-history/<int:id>', MedicalHistoryView.as_view(), name='medical-history'),
    path('precaution/<int:diagnosis_id>', RecommandationsView.as_view(), name='recommendations'),
    path('doctors', DoctorListView.as_view(), name='doctors'),
    path('patients-list', PatientListView.as_view(), name='patients'),
    path('updaterecommandation/<int:recommandation_id>', UpdateRecommendationView.as_view(), name='updaterecommendations'),




 ]