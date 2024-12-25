import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-home', // Change this to your actual selector
  templateUrl: './home.component.html', // Adjust the path if necessary
  styleUrls: ['./home.component.css'] // Adjust the path if necessary
})
export class HomeComponent implements OnInit {
  authenticated = false; // Track authentication status
  userName: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Check authentication status on initialization
    this.authService.isAuthenticated().subscribe(
      (isAuthenticated: boolean) => {
        this.authenticated = isAuthenticated; // Update the authenticated property
        if (this.authenticated) {
          this.refreshPage(); // Refresh the page when authenticated
        }
      },
      error => {
        console.error('Error checking authentication status:', error);
        this.authenticated = false; // Default to not authenticated on error
      }
    );

    this.userName = this.authService.getNameFromToken();
    console.log('User name from token:', this.userName);
  }

  refreshPage(): void {
    // Navigate to the current route to refresh
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['home']); // Replace 'home' with your actual route path
    });
  }
}
