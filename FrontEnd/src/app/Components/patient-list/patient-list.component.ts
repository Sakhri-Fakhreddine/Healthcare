import { Component, OnInit } from '@angular/core';
import { MedicalHistoryService } from 'src/app/medical-history-service.service';
import { AuthService } from 'src/app/services/auth.service';
import { DoctorService } from 'src/app/services/doctor.service';
import { PatientListService } from 'src/app/services/patient-list.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-patient-list',
  templateUrl: './patient-list.component.html',
  styleUrls: ['./patient-list.component.css']
})
export class PatientListComponent implements OnInit{
  patients: any[] = [];
  // List of available doctor images
  patientImages = [
    // '../assets/img/patients/1.png',
    // '../assets/img/patients/2.png',
    // '../assets/img/patients/3.png',
    // '../assets/img/patients/4.png',
    // '../assets/img/patients/5.png',
    '../assets/img/patients/6.png',
    '../assets/img/patients/7.png', 
  ];
  constructor(
    private authService: AuthService,
    private patientService: PatientListService,
    private router: Router 
  ) {}

  ngOnInit(): void {
    this.loadPatients();
  }

  loadPatients(): void {
    const token = this.authService.getToken(); // Ensure getToken is working and retrieves the token correctly.

    if (token) { // Check if token is not null
      // Fetch all doctors from the backend
      this.patientService.getPatients(token).subscribe(
        (data) => {
          this.patients = data; // List of all doctors
          console.log('Patients fetched successfully:', this.patients);

          // Assign images based on gender and store in local storage
          this.patients.forEach(patient => {
            patient.imageUrl = this.getPatientImageByGender(patient); // Assign image based on gender
            // Store the image URL in local storage to persist on refresh
            localStorage.setItem(`patientImage_${patient.id}`, patient.imageUrl);
          });
        },
        (error) => {
          console.error('Error fetching doctors:', error);
        }
      );
    } else {
      console.error('No authentication token found.');
      // Handle error if token is not found (maybe redirect to login page)
    }
  }
  getPatientImageByGender(patient: any): string {
    // Check if the image is already saved in localStorage for this doctor
    const savedImage = localStorage.getItem(`patientImage_${patient.id}`);
    if (savedImage) {
      return savedImage; // Use saved image from localStorage if exists
    }
    if (patient.gender === 'female') {
      return this.patientImages[0]; // Female doctors always get image 7
    } else {
      // Male doctors will get a random image from the first 6
      return this.patientImages[1];
    }
  }
  viewMedicalHistory(id: number, patientName: string): void {
    this.router.navigate(['/medical-history', id, patientName]);  // Pass patient ID and name as route parameters
  }
  
}
