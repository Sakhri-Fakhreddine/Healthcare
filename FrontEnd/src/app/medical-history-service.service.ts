import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MedicalHistoryService {
  private apiUrl = 'http://127.0.0.1:8000/api/medical-history';  // Replace with your API URL

  constructor(private http: HttpClient) {}

  // Fetch medical history for the authenticated user
  getMedicalHistory(userId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${userId}`);
    // return this.http.get<any>(`${this.apiUrl}/${id}/`, { headers });
  }
}
