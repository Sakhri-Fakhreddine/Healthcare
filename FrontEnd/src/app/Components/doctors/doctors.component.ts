import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { DoctorService } from 'src/app/services/doctor.service';

@Component({
  selector: 'app-doctors',
  templateUrl: './doctors.component.html',
  styleUrls: ['./doctors.component.css']
})
export class DoctorsComponent implements OnInit {
  doctors: any[] = [];

  // List of available doctor images
  doctorImages = [
    '../assets/img/experts/1.png',
    '../assets/img/experts/2.png',
    '../assets/img/experts/3.png',
    '../assets/img/experts/4.png',
    '../assets/img/experts/5.png',
    '../assets/img/experts/6.png',
    '../assets/img/experts/7.png' // This image will be used for female doctors
  ];

  constructor(
    private doctorService: DoctorService,
    private authService: AuthService) {}

  ngOnInit(): void {
    this.loadDoctors();
  }

  loadDoctors(): void {
    const token = this.authService.getToken(); // Ensure getToken is working and retrieves the token correctly.

    if (token) { // Check if token is not null
      // Fetch all doctors from the backend
      this.doctorService.getDoctors(token).subscribe(
        (data) => {
          this.doctors = data; // List of all doctors
          console.log('Doctors fetched successfully:', this.doctors);

          // Assign images based on gender and store in local storage
          this.doctors.forEach(doctor => {
            doctor.imageUrl = this.getDoctorImageByGender(doctor); // Assign image based on gender
            // Store the image URL in local storage to persist on refresh
            localStorage.setItem(`doctorImage_${doctor.id}`, doctor.imageUrl);
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

  // Function to get image based on gender
  getDoctorImageByGender(doctor: any): string {
    // Check if the image is already saved in localStorage for this doctor
    const savedImage = localStorage.getItem(`doctorImage_${doctor.id}`);
    if (savedImage) {
      return savedImage; // Use saved image from localStorage if exists
    }

    if (doctor.gender === 'female') {
      return this.doctorImages[6]; // Female doctors always get image 7
    } else {
      // Male doctors will get a random image from the first 6
      const randomIndex = Math.floor(Math.random() * 6); // Random index between 0 and 5
      return this.doctorImages[randomIndex];
    }
  }
}
