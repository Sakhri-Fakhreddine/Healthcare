from django.forms import ValidationError
from django.shortcuts import render
from rest_framework.response import Response
from .models import Recommandation
from rest_framework import status
from rest_framework.views import APIView

class UpdateRecommendationView(APIView):
    def post(self, request, recommandation_id):
        try:
            # Fetch the recommendation object by its ID
            recommendation = Recommandation.objects.get(id=recommandation_id)

            # Get the doctor's comment from the request body
            doctor_comment = request.data.get('comment')

            if doctor_comment:
                recommendation.doctor_comment = doctor_comment
                recommendation.save()
                return Response({"message": "Comment updated successfully!"}, status=status.HTTP_200_OK)
            else:
                raise ValidationError("Comment cannot be empty.")

        except Recommandation.DoesNotExist:
            return Response({"error": "Recommendation not found."}, status=status.HTTP_404_NOT_FOUND)

        except ValidationError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)