import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PrecautionserviceService {

  private apiUrl = `http://127.0.0.1:8000/api/precaution/`; // Ensure the API URL is correct

  constructor(private http: HttpClient) {}

  getRecommendations(diagnosisId: string): Observable<any> {
    // Send GET request instead of POST to fetch recommendations
    return this.http.get<any>(`${this.apiUrl}${diagnosisId}`);
  }
}
