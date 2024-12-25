import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ManageProfileService } from 'src/app/services/manage-profile.service';
import { Router } from '@angular/router'; // Import Router
import { AuthStateServiceService } from 'src/app/services/auth-state-service.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  userName: string | null = null;
  userId: number | null = null; // To store the user ID

  constructor(
    private authService: AuthService,
    private manageProfileService: ManageProfileService,
    private router: Router,
    private authStateService: AuthStateServiceService // Inject the AuthStateService
  ) {}

  ngOnInit(): void {
    // Retrieve the username and ID from the AuthService
    this.userName = this.authService.getNameFromToken(); // Assume this method exists
    this.userId = this.authService.getUserId(); // Assume this method also exists
  }

  // Method to navigate to the edit profile page
  editUser(): void {
    this.router.navigate(['/edit-profile']);  // Redirect to edit-profile component
  }

  deleteUser(): void {
    const token = this.authService.get(); // Get the token from AuthService
    if (token) { // Check if the token is not null
      if (confirm("Are you sure you want to delete your account?")) {
        if (this.userId) { // Ensure userId is defined
          this.manageProfileService.deleteUser(token, this.userId).subscribe({
            next: () => {
              alert("User account deleted successfully.");
              this.authService.logout();
              this.authStateService.setAuthenticated(false); // Notify that the user is no longer authenticated
              this.router.navigate(['/signin']); // Redirect after deletion
            },
            error: (error) => {
              console.error('Error deleting user account', error);
              alert("Error deleting user account.");
            }
          });
        } else {
          alert("User ID not found.");
        }
      }
    } else {
      alert("You are not authenticated."); // Handle the case where the token is null
    }
  }
}