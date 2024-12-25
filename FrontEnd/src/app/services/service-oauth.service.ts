import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OAuthService } from 'angular-oauth2-oidc';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Token } from '@angular/compiler';

// Interface pour la réponse du token OAuth
interface AuthResponse {
  access_token: string;
}

@Injectable({
  providedIn: 'root'
})
export class ServiceOAuthService {

  private apiUrl = 'http://localhost:8000/api';  // URL de l'API Django

  constructor(
    private http: HttpClient, 
    private oauthService: OAuthService, 
    private router: Router
  ) {
   
  }

  

socialAuth(token:any): Observable<{ msg: string, token: Token}> {
  return this.http.post<{ msg: string, token:Token }>(`${this.apiUrl}/signin/${token}`, {token});
}
}
