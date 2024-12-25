import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { MedicalHistoryService } from 'src/app/medical-history-service.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-medical-history',
  templateUrl: './medical-history.component.html',
  styleUrls: ['./medical-history.component.css']
})
export class MedicalHistoryComponent implements OnInit {
  clientName: string | null = null;
  medicalHistory: any[] = [];  // To store the fetched medical history
  userId: number | null = null;
  userRole: string | null = null;
  patientId: number | null = null;  // Ensure patientId is a number

  constructor(
    private medicalHistoryService: MedicalHistoryService,
    private authService: AuthService,
    private route: ActivatedRoute 
  ) {}

  ngOnInit(): void {
    this.userId = this.authService.getUserId();  // Get user ID from AuthService
    this.userRole = this.authService.getRoleFromToken(); // Get user role (patient or doctor)
    
    if (this.userRole === 'patient'){
      this.clientName = this.authService.getNameFromToken();

    }
    else if (this.userRole === 'doctor') 
      {
        this.route.paramMap.subscribe(params => {
        this.patientId = Number(params.get('id')); // Patient ID from URL params
        this.clientName = params.get('name'); // Patient name from URL params
      });}
    // Get authenticated user's role, name, and ID 
    
  
    if (this.userRole === 'patient' && this.userId !== null) {
      // If user is a patient, load medical history using the patient's ID
      this.loadMedicalHistory();
    } else if (this.userRole === 'doctor') {
      // If user is a doctor, get the patient ID from the route and load the selected patient's medical history
      const patientIdParam = this.route.snapshot.paramMap.get('id');  // Get patient ID from URL
      

      if (patientIdParam) {
        // Convert the patientIdParam to a number
        this.patientId = Number(patientIdParam);  // Convert to number
        if (this.patientId) {
          this.loadMedicalHistoryForDoctor(this.patientId); // Pass the patientId as a number
        } else {
          console.error('Invalid patient ID found in the URL');
        }
      } else {
        console.error('No patient ID found in the URL');
      }
    } else {
      alert('User not authenticated or invalid role!');
    }
  }

  // Method to fetch medical history for the authenticated user
  loadMedicalHistory(): void {
    if (this.userId) {
      this.medicalHistoryService.getMedicalHistory(this.userId).subscribe(
        (data) => {
          this.medicalHistory = data;
        },
        (error) => {
          console.error('Error loading medical history:', error);
          alert('Failed to load medical history.');
        }
      );
    }
  }

  // Method to fetch medical history for a doctor viewing a selected patient
  loadMedicalHistoryForDoctor(patientId: number): void {
    this.medicalHistoryService.getMedicalHistory(patientId).subscribe(
      (data) => {
        this.medicalHistory = data;
      },
      (error) => {
        console.error('Error loading medical history for doctor:', error);
        alert('Failed to load patient medical history.');
      }
    );
  }
}
