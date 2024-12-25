import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ServiceOAuthService } from 'src/app/services/service-oauth.service';  // Import OAuth service

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  signUpForm: FormGroup;
  errorMessage!: string;

  constructor(
    private fb: FormBuilder, 
    private authService: AuthService, 
    private router: Router,
    private oauthService: ServiceOAuthService  // Inject OAuth service
  ) {
    this.signUpForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      phone_number: ['', [Validators.required, Validators.pattern(/^[0-9]{8}$/)]],
      gender: ['', Validators.required],
      age: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]]
    });
  }

  ngOnInit(): void {
    this.errorMessage = '';
  }

  onSubmit(): void {
    if (this.signUpForm.valid) {
      this.authService.register(this.signUpForm.value).subscribe({
        next: (response) => {
          console.log('Registration successful', response);
          this.router.navigate(['/signin']);
        },
        error: (err) => {
          console.error('Registration error', err);
          this.errorMessage = 'Email already exists!';
        }
      });
    } else {
      this.errorMessage = 'Please fill out all required fields correctly.';
    }
  }

}
