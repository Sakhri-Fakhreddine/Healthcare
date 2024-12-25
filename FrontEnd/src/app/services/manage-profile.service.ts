import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

// src/app/user.model.ts

export interface User {
  id?: number;
  name: string;
  gender: 'male' | 'female';
  email: string;
  phone_number?: string;
  age?: number;
  role: 'doctor' | 'patient';
  specialization?: string; // Only for doctors
  license_number?: string; // Only for doctors
  medical_history?: string; // Only for patients
  date_of_birth?: string; // Only for patients
}

@Injectable({
  providedIn: 'root'
})
export class ManageProfileService {
  private apiUrl = 'http://localhost:8000/api/user'; // Adjust this URL according to your Django API

  constructor(private http: HttpClient) {}

  // Fetch all users
  getAllUsers(token: string): Observable<User[]> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`, // Adjust if using a different method
    });
    return this.http.get<User[]>(this.apiUrl, { headers });
  }

  // Fetch a single user by ID
  getUserById(id: number, token: string): Observable<User> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
    });
    return this.http.get<User>(`${this.apiUrl}/${id}/`, { headers });
  }

  // Create a new user (doctor or patient)
  createUser(token: string, user: User): Observable<User> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
    return this.http.post<User>(this.apiUrl, user, { headers });
  }

  // Update an existing user
  updateUser(token: string, user: User): Observable<User> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
    return this.http.put<User>(`${this.apiUrl}`, user, { headers });
  }

  // Delete a user
  deleteUser(token: string, id: number): Observable<void> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
    });
    console.log("headrs", headers);
    
    return this.http.delete<void>(`${this.apiUrl}`, { headers });
  }
}
