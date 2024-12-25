import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from './manage-profile.service';

@Injectable({
  providedIn: 'root'
})
export class PatientListService {private apiUrl = 'http://localhost:8000/api/patients-list'; // Backend endpoint

  constructor(private http: HttpClient) {}

  // Fetch all patients
  getPatients(token: string): Observable<User[]> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`, // Adjust if using a different method
    });
    return this.http.get<User[]>(this.apiUrl, { headers });
  }
}
