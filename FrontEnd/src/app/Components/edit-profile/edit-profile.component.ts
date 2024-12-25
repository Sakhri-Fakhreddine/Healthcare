import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ManageProfileService } from 'src/app/services/manage-profile.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {
  signUpForm!: FormGroup;
  errorMessage!: string;
  userId!: number | null;
  user: any = {};

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private manageProfile: ManageProfileService,
    private snackBar: MatSnackBar,
    private router:Router
  ) {
    // Initialize the form
    this.signUpForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone_number: ['', Validators.required],
      gender: ['', Validators.required],
      age: ['', [Validators.required, Validators.min(1)]] // Example for age validation
    });
  }

  ngOnInit(): void {
    // Get the user information directly from the decoded JWT
    const decodedToken = this.authService.getDecodedToken();
    
    if (decodedToken) {
      // Populate form with data from the token
      this.userId = decodedToken.id; // Ensure userId is set from the token
      this.signUpForm.patchValue({
        name: decodedToken.name,
        email: decodedToken.email,
        phone_number: decodedToken.phone_number,
        gender: decodedToken.gender,
        age: decodedToken.age
      });
    } else {
      this.errorMessage = 'User information could not be loaded from the token.';
    }
  }

  updateProfile(): void {
    if (this.signUpForm.valid) {
      const updatedUserData = {
        id: this.userId, // Include the user ID
        ...this.signUpForm.value // Spread the form values
      };
  
      // Remove password from updatedUserData if it exists
      delete updatedUserData.password;
  
      const token = this.authService.getToken(); // Get the JWT token
  
      // Check if the token is valid before making the request
      if (token) {
        // Send the updated user data to the backend
        this.manageProfile.updateUser(token, updatedUserData).subscribe({
          next: (response) => {
            // Handle successful update
            this.snackBar.open('Profile updated successfully!', 'Close', {
              duration: 3000,
              panelClass: ['snackbar-success']
            });
            console.log('Profile updated:', response);
          },
          error: (error) => {
            // Handle error case
            console.error('Error updating profile:', error);
            if (error.error && error.error.password) {
              this.snackBar.open('Password is required or invalid.', 'Close', {
                duration: 3000,
                panelClass: ['snackbar-error']
              });
            } else {
              this.snackBar.open('Failed to update profile. Please try again.', 'Close', {
                duration: 3000,
                panelClass: ['snackbar-error']
              });
            }
          }
        });
      } else {
        // Handle the case where the token is not available
        this.snackBar.open('User is not authenticated. Please log in again.', 'Close', {
          duration: 3000,
          panelClass: ['snackbar-error']
        });
      }
    } else {
      this.errorMessage = 'Please fill out all fields correctly.';
    }
  }
  
}
