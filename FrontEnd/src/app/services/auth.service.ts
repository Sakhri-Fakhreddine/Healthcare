import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private registerUrl = 'http://localhost:8000/api/register'; // API endpoint for registration
  private loginUrl = 'http://localhost:8000/api/login';       // API endpoint for login
  private logoutUrl = 'http://localhost:8000/api/logout';     // API endpoint for logout
  private apiUrl = 'http://localhost:8000/api'; // Base URL for your API
  private tokenKey = 'jwt'; // Replace with your actual token key


  constructor(private http: HttpClient) {}

  register(userData: any): Observable<any> {
    console.log("Registering user with data:", userData);
    return this.http.post(this.registerUrl, userData);
  }

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials);
  }

   // Logout method
   logout(): Observable<any> {
    // Here you can add any logic needed for logout, like token removal
    localStorage.removeItem('jwt'); // Remove token from local storage
    return of(null); // Return an observable indicating logout success
  }
  isAuthenticated(): Observable<boolean> {
    const token = localStorage.getItem('jwt');
    return of(!!token); // Returns true if the token exists, false otherwise
  }
  
    // Manually decode the JWT token (without using jwt-decode)
  getDecodedToken(): any {
    const token = localStorage.getItem(this.tokenKey);
    if (token) {
      try {
        const base64Url = token.split('.')[1]; // Get the payload part (second part of JWT)
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/'); // Replace URL-safe chars
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload); // Convert payload to JSON object
      } catch (error) {
        console.error('Failed to decode token manually', error);
        return null;
      }
    }
    return null;
  }

  // Get the name from the decoded token
  getNameFromToken(): string | null {
    const decodedToken = this.getDecodedToken();
    return decodedToken ? decodedToken.name : null;
  }

  // gt role from the decoded token 
  getRoleFromToken(): string | null {
    const decodedToken = this.getDecodedToken();
    return decodedToken ? decodedToken.role : null;
  }
   // Replace with your actual logic to retrieve the token
   get(): string | null {
    return localStorage.getItem('jwt'); // Assuming you're storing the JWT in localStorage
  }

  // Method to retrieve the user ID
  getUserId(): number | null {
    const token = this.get();
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1])); // Decode the token
      return payload.id || null; // Return the user ID from the payload
    }
    return null;
  }

  // Method to retrieve the token
  getToken(): string | null {
    return this.get(); // Reusing the existing get method
  }

}