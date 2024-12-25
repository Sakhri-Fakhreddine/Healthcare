# views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed
from rest_framework import status
from .serializers import UserSerializer
from .models import User
import jwt
import datetime
from rest_framework.permissions import IsAuthenticated
from django.conf import settings
from django.contrib.auth import get_user_model
from google.oauth2 import id_token
from google.auth.transport import requests
from django.conf import settings
from django.shortcuts import get_object_or_404
from rest_framework import status
import logging
# import joblib
# import numpy as np
# from django.http import JsonResponse

SECRET_KEY = 'your-secret-key'
CLIENT_ID = '743131499790-sso6hkgri5gvi51e5kukojph0p64sp0l.apps.googleusercontent.com'




class RegisterView(APIView):
    def post(self, request):
        print("Données reçues pour l'inscription:", request.data)
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            print("Utilisateur enregistré:", serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            print("Erreur de validation:", serializer.errors)  # Log errors
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({'error': 'Email does not exist.'}, status=status.HTTP_404_NOT_FOUND)

        if not user.check_password(password):
            return Response({'error': 'Incorrect password!'}, status=status.HTTP_401_UNAUTHORIZED)

        payload = {
            'id': user.id,
            'name': user.name,  # Adding name
             'email': user.email,  # Adding email
             'age': user.age, 
             'role':user.role,
            'phone_number': user.phone_number, # Adding phone number 
           'gender': user.gender,  # Adding gender (make sure this field exists in your User model)
           'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=60),  # Expiration time
          'iat': datetime.datetime.utcnow()  # Issued at time
        }

        token = jwt.encode(payload, settings.JWT_SECRET, algorithm='HS256')

        response = Response()
        response.set_cookie(key='jwt', value=token, httponly=True, secure=False)  # Set secure=True if using HTTPS
        response.data = {
            'message': 'Login successful',
            'jwt': token  # Optionally include the token in the response
        }
        return response




class UserView(APIView):

    def get(self, request):
        token = request.COOKIES.get('jwt')
        if not token:
            raise AuthenticationFailed('Unauthenticated!')

        try:
            payload = jwt.decode(token, settings.JWT_SECRET, algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Token has expired!')
        except jwt.InvalidTokenError:
            raise AuthenticationFailed('Invalid token!')

        user = get_object_or_404(User, id=payload['id'])
        serializer = UserSerializer(user)
        return Response(serializer.data)

    def put(self, request):
    # Retrieve the Authorization header
        auth_header = request.headers.get('Authorization')
        print("token", auth_header)
        # print("the data :", request.data)
        
        if not auth_header or not auth_header.startswith('Bearer '):
            raise AuthenticationFailed('Unauthenticated!')

        # Extract the token from the Authorization header
        # Retrieve the Authorization header
        auth_header = request.headers.get('Authorization')
        print("token", auth_header)
        # print("the data :", request.data)
        
        if not auth_header or not auth_header.startswith('Bearer '):
            raise AuthenticationFailed('Unauthenticated!')

        # Extract the token from the Authorization header
        token = auth_header.split(' ')[1]

        try:
            # Decode the token
            payload = jwt.decode(token, settings.JWT_SECRET, algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Token has expired!')
        except jwt.InvalidTokenError:
            raise AuthenticationFailed('Invalid token!')

        # Get the user based on the token payload
        user = get_object_or_404(User, id=payload['id'])

        # Deserialize and validate the incoming data
        
        serializer = UserSerializer(user, data=request.data, partial=True)  # Allow partial updates
        if serializer.is_valid():
            serializer.save()  # Save the updated user information
            return Response(serializer.data, status=status.HTTP_200_OK)

        # If data is invalid, return validation errors
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request):
        print("Request Headers", request.headers)
        
        # Get the Authorization header
        auth_header = request.headers.get('Authorization')
        
        if not auth_header or not auth_header.startswith('Bearer '):
            raise AuthenticationFailed('Unauthenticated!')

        # Extract the token from the Authorization header
        token = auth_header.split(' ')[1]
        print("Extracted Token", token)

        try:
            # Decode the token
            payload = jwt.decode(token, settings.JWT_SECRET, algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Token has expired!')
        except jwt.InvalidTokenError:
            raise AuthenticationFailed('Invalid token!')

        # Get the user and delete
        user = get_object_or_404(User, id=payload['id'])
        user.delete()

        return Response(status=status.HTTP_204_NO_CONTENT)
    

class LogoutView(APIView):
    def post(self, request):
        response = Response()
        response.delete_cookie('jwt')
        response.data = {
            'message': 'Successfully logged out'
        }
        return response
    



class SigninView(APIView):
    def post(self, request, token):
        try:
            if not token:
                return Response({'error': 'Token is missing'}, status=status.HTTP_400_BAD_REQUEST)
            
            # logger = logging.getLogger(__name__)
            # logger.debug(f"Received data: {request.data}")


            # Verify the token using Google's OAuth2 Client
            id_info = id_token.verify_oauth2_token(token, requests.Request(), settings.CLIENT_ID)

            # Extract user information from the token
            email = id_info.get('email')
            name = id_info.get('name')
            user_id = id_info.get('sub')

            # Check if the user already exists in the database
            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                # If the user doesn't exist, create a new user
                user = User.objects.create_user(
                    username=name,
                    email=email,
                    password=None
                )

            payload = {
                'id': user.id,
                'username': user.username,
                'name': user.username,
                'email': user.email,
                'age': user.age,
                'role': user.role,
                'phone_number': user.phone_number,
                'gender': user.gender,
                'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=60),
                'iat': datetime.datetime.utcnow()
            }

            # Generate JWT token
            token = jwt.encode(payload, settings.JWT_SECRET, algorithm='HS256')

            return Response({'message': 'Welcome', 'token': token}, status=status.HTTP_200_OK)

        except ValueError as e:
            # Invalid token
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            # Handle other exceptions
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



class DoctorListView(APIView):
    # permission_classes = [IsAuthenticated]  # Ensures the user is authenticated

    def get(self, request):
        try:
            # Retrieve all users with the role 'doctor'
            doctors = User.objects.filter(role='doctor')
            if not doctors.exists():
                return Response({"message": "No doctors found"}, status=404)

            # Serialize the list of doctors
            serializer = UserSerializer(doctors, many=True)
            return Response(serializer.data, status=200)
        except Exception as e:
            return Response({"error": str(e)}, status=500)


class PatientListView(APIView):

    # permission_classes = [IsAuthenticated]  # Ensures the user is authenticated

    def get(self, request):
        try:
            # Retrieve all users with the role 'doctor'
            patients = User.objects.filter(role='patient')
            if not patients.exists():
                return Response({"message": "No patients found"}, status=404)

            # Serialize the list of doctors
            serializer = UserSerializer(patients, many=True)
            return Response(serializer.data, status=200)
        except Exception as e:
            return Response({"error": str(e)}, status=500)
