from django.forms import ValidationError
import pandas as pd
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .diagnosis_model import make_diagnosis
from .models import Diagnosis
from datetime import date
import json
import jwt
from django.conf import settings
from django.contrib.auth import get_user_model
from rest_framework.exceptions import AuthenticationFailed
from Recommandation.models import  Recommandation 


class SymptomsDiagnosisView(APIView):
    def get_user_from_token(self, request):
        # Extract the token from the Authorization header
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            raise AuthenticationFailed('Token is missing or malformed')

        # Extract the token from the header (after "Bearer ")
        token = auth_header.split(' ')[1]

        if not token:
            raise AuthenticationFailed('Token is required')

        try:
            # Decode the JWT token using the secret key
            payload = jwt.decode(token, settings.JWT_SECRET, algorithms=['HS256'])
            
            # Get the user ID from the token's payload
            user_id = payload.get('id')
            
            if not user_id:
                raise AuthenticationFailed('Invalid token, user ID not found')

            # Retrieve the user from the database
            user = get_user_model().objects.get(id=user_id)
            return user
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Token has expired')
        except jwt.InvalidTokenError:
            raise AuthenticationFailed('Invalid token')
        except get_user_model().DoesNotExist:
            raise AuthenticationFailed('User not found')
        except Exception as e:
            raise AuthenticationFailed(f'Error retrieving user: {str(e)}')

    def post(self, request):
        print(request.headers)  # Debugging headers

        # Get the symptoms from the request
        symptoms_data = request.data.get('symptoms')
        diagnosis_description = request.data.get('diagnosis_description')
        diagnosis_date = request.data.get('diagnosis_date', date.today())  # Use current date if not provided

        # Validate that symptoms_data is provided and is a list
        if not symptoms_data or not isinstance(symptoms_data, list):
            return Response({'error': 'Symptoms must be a list of strings'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Call the diagnosis function to get the AI-generated diagnosis and confidence
            diagnosis, confidence = make_diagnosis(symptoms_data)
            print(diagnosis)

            # Get the authenticated user
            user = self.get_user_from_token(request)  # Use self here to call the instance method

            # Create a new Diagnosis object and store the symptoms as JSON
            diagnosis_obj = Diagnosis.objects.create(
                user=user,
                diagnosis_date=diagnosis_date,
                diagnosis_description= diagnosis,  # Use AI diagnosis if no description is provided
                diagnosis_confidence=confidence,
                entered_symptoms=json.dumps(symptoms_data),  # Store the list as JSON
            )

            # Save the Diagnosis object and return the response
            return Response({
                'diagnosis': diagnosis,
                'confidence': confidence,
                'diagnosis_id': diagnosis_obj.id,
                'user': diagnosis_obj.user.id,
                'date': diagnosis_obj.diagnosis_date,
                'symptoms': json.loads(diagnosis_obj.entered_symptoms),  # Decode the JSON and return as a list
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            # Handle unexpected errors
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class MedicalHistoryView(APIView):
    def get(self, request, id):  # Accept `id` parameter from the URL
        print(f"Request received for user with ID: {id}")  # Move the print inside the method
        try:
            # Retrieve the medical history based on the user ID
            diagnoses = Diagnosis.objects.filter(user_id=id).order_by('-diagnosis_date')

            diagnosis_data = [
                {
                    'diagnosis_id': diagnosis.id,
                    'diagnosis_description': diagnosis.diagnosis_description,
                    'diagnosis_date': diagnosis.diagnosis_date,
                    'diagnosis_confidence':diagnosis.diagnosis_confidence,
                    'symptoms': diagnosis.get_symptoms_list(),  # Decode JSON for symptoms
                }
                for diagnosis in diagnoses
            ]
            print(f"Diagnoses  data sent : {diagnosis_data}")

            return Response(diagnosis_data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class RecommandationsView(APIView):
    """
    API View to fetch the diagnosis data and its corresponding recommendations.
    """
    def get(self, request, diagnosis_id):
        try:
            # Fetch the diagnosis object based on the diagnosis_id from the URL
            diagnosis_obj = Diagnosis.objects.get(id=diagnosis_id)
            
            # Retrieve the diagnosis description
            diagnosis_description = diagnosis_obj.diagnosis_description
            
            # Fetch the corresponding precautions (recommendations) from a CSV file
            precautions = self.get_precautions(diagnosis_description)
            
            # Add the recommendation to the database and retrieve the saved recommendation
            recommendation = self.add_recommendation_to_db(diagnosis_obj, precautions)
            
            # Serialize the recommendation object
            recommendation_data = {
                'id': recommendation.id,
                'diagnosis': recommendation.diagnosis.id,
                'details': recommendation.details,
                'doctor_comment': recommendation.doctor_comment
            }

            # Prepare the response with diagnosis data and corresponding recommendations
            response_data = {
                'diagnosis_id': diagnosis_obj.id,
                'diagnosis_description': diagnosis_obj.diagnosis_description,
                'diagnosis_date': diagnosis_obj.diagnosis_date,
                'diagnosis_confidence': diagnosis_obj.diagnosis_confidence,
                'precautions': recommendation_data,  # Include the entire recommendation object
                'symptoms': diagnosis_obj.entered_symptoms
            }

            return Response(response_data, status=status.HTTP_200_OK)

        except Diagnosis.DoesNotExist:
            return Response({'error': 'Diagnosis not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


    def get_precautions(self, disease, file_path=r'./aiModel/diseases_with_precautions.csv'):
        """
        Retrieve the precautions for the given disease from a CSV file.
        """
        try:
            # Read the CSV with diseases and their precautions
            data = pd.read_csv(file_path)

            if "disease" not in data.columns or "precautions" not in data.columns:
                raise ValidationError("CSV file must contain 'disease' and 'precautions' columns.")

            precautions_mapping = data.set_index("disease")["precautions"].to_dict()
            

            # Return the precautions for the disease, or a default message if not found
            return precautions_mapping.get(disease, "Please check with your doctor for check-ups.")
        except Exception as e:
            raise ValidationError(f"Error retrieving precautions: {str(e)}")
    def add_recommendation_to_db(self, diagnosis_obj, precautions):
        try:
            # Check if a recommendation already exists for this diagnosis
            recommendation = Recommandation.objects.filter(diagnosis=diagnosis_obj).first()
            
            if recommendation:
                # If a recommendation exists, return it
                return recommendation
            
            # Create the Recommendation instance and save it to the database
            recommendation = Recommandation.objects.create(
                diagnosis=diagnosis_obj,
                details=precautions,
                doctor_comment=None  # Initially set to None
            )
            return recommendation
        except Exception as e:
            raise ValidationError(f"Error saving recommendation to the database: {str(e)}")
