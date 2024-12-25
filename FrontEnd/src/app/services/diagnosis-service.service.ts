import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';  
import { catchError } from 'rxjs/operators';  // For error handling

@Injectable({
  providedIn: 'root',
})
export class DiagnosisService {
  private apiUrl = 'http://127.0.0.1:8000/api/diagnosis/'; // Replace with your Django API endpoint

  constructor(private http: HttpClient, private authService: AuthService) {}

  /**
   * Sends the list of selected symptoms to the backend for diagnosis.
   * @param diagnosisData An object containing the patient ID, symptoms, diagnosis description, and diagnosis date.
   * @returns An observable containing the diagnosis result and the saved diagnosis information.
   */
  createDiagnosis(diagnosisData: {
    user: number;
    symptoms: string[];
    diagnosis_description: string;
    diagnosis_date: string;
  }): Observable<any> {
    // Retrieve the token using AuthService
    const token = this.authService.getToken();
    
    if (!token) {
      // Handle error if no token is available
      throw new Error('Authentication token is missing');
    }

    // Set the Authorization header with the Bearer token
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
    });

    // Log the request data and headers for debugging
    console.log('Request Data:', diagnosisData);
    console.log('Request Headers:', headers);

    // Make the POST request to the API with the diagnosis data and authorization header
    return this.http.post(this.apiUrl, diagnosisData, { headers }).pipe(
      catchError((error) => {
        console.error('Error in creating diagnosis:', error);
        throw error;  // Rethrow the error or handle it accordingly
      })
    );
  }
}
