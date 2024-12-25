import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthStateServiceService } from 'src/app/services/auth-state-service.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  authenticated = false; // Track authentication status
  userName: string | null = null;
  decodedToken : string|null=null;
  Role : string | null = null ;
  isdoctor = false ; // see if it is a doctor or not 

  constructor(private authService: AuthService, private authStateService: AuthStateServiceService, private router: Router) {}

  ngOnInit(): void {
    // Subscribe to authentication status from AuthStateService
    this.authStateService.authenticated$.subscribe(isAuthenticated => {
      this.authenticated = isAuthenticated; // Update the authenticated property
      if (isAuthenticated) {
        this.userName = this.authService.getNameFromToken(); // Update the username if authenticated
        this.decodedToken = this.authService.getDecodedToken();
        this.Role = this.authService.getRoleFromToken()
        console.log("the role of the user is ", this.Role);
        if (this.Role?.toLowerCase() === 'doctor') {
        this.isdoctor = true;
    }
        console.log('the decoded token :',this.decodedToken);
        console.log('User name from token:', this.userName);
      } else {
        this.userName = null; // Clear the username if not authenticated
      }
    });
    
    // Initial check for authentication status
    this.authService.isAuthenticated().subscribe(
      (isAuthenticated: boolean) => {
        this.authenticated = isAuthenticated; // Update the authenticated property
        if (this.authenticated) {
          this.userName = this.authService.getNameFromToken();
        }
      },
      error => {
        console.error('Error checking authentication status:', error);
        this.authenticated = false; // Default to not authenticated on error
      }
    );

    // // get user role from the token 
    this.Role = this.authService.getRoleFromToken()
    console.log("the role of the user is ", this.Role);
    if (this.Role?.toLowerCase() === 'doctor') {
      this.isdoctor = true;
    }
}

  logout(): void {
    this.authService.logout().subscribe(
      () => {
        this.authStateService.setAuthenticated(false); // Update the authenticated status on logout
        console.log('User logged out successfully');
        this.router.navigate(['/']);
      },
      error => {
        console.error('Logout failed:', error);
      }
    );
  }
}