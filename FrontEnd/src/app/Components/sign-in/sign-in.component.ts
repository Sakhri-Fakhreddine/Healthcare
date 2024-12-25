import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { AuthStateServiceService } from 'src/app/services/auth-state-service.service';
import { googleAuthConfig, facebookAuthConfig, githubAuthConfig } from '../../auth.config';
import { OAuthService } from 'angular-oauth2-oidc';
import { SocialAuthService } from "@abacritt/angularx-social-login";
import { SocialUser } from "@abacritt/angularx-social-login";
import { ServiceOAuthService } from 'src/app/services/service-oauth.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent {
  loginForm!: FormGroup;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private socialAuth: SocialAuthService,
    private OAuth : ServiceOAuthService,
    private router: Router,
    private authStateService: AuthStateServiceService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });

    this.socialAuth.authState.subscribe((user) => {
      console.log(user);
      this.OAuth.socialAuth(user.idToken).subscribe(
        (response: any) => {
          console.log(response);
          localStorage.setItem('jwt', response.token);
          this.authStateService.setAuthenticated(true);
          this.router.navigate(['/']);
        },
        (error) => {
          console.error('OAuth Error:', error);
        }
      );
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          localStorage.setItem('jwt', response.jwt);
          this.authStateService.setAuthenticated(true);
          this.redirectBasedOnRole(response.jwt);
        },
        error: (err) => {
          console.error('Login error', err);
          this.errorMessage = err.error.message || 'Login failed';
        }
      });
    } else {
      console.log('Form is invalid');
    }
  }

  redirectBasedOnRole(token: string): void {
    const payload = this.decodeToken(token);
    const role = payload?.role;
    if (role === 'doctor') {
      this.router.navigate(['/doctor']);
    } else if (role === 'patient') {
      this.router.navigate(['']);
    }
  }

  private decodeToken(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(atob(base64));
    } catch (error) {
      console.error('Failed to decode token', error);
      return null;
    }
  }
}
