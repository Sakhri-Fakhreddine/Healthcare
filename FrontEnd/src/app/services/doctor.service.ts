import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from './manage-profile.service';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {
  private apiUrl = 'http://localhost:8000/api/doctors'; // Backend endpoint

  constructor(private http: HttpClient) {}

  // Fetch all doctors
  getDoctors(token: string): Observable<User[]> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`, // Adjust if using a different method
    });
    return this.http.get<User[]>(this.apiUrl, { headers });
  }
}