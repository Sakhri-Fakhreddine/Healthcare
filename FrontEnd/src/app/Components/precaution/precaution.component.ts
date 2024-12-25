import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PrecautionserviceService } from 'src/app/precautionservice.service';
import * as $ from 'jquery';
import 'select2';
import { AuthService } from 'src/app/services/auth.service';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-precaution',
  templateUrl: './precaution.component.html',
  styleUrls: ['./precaution.component.css']
})
export class PrecautionComponent {
  diagnosisData: any = {};  // Store the diagnosis attributes
  recommendationsData: string[] = [];  // Store recommendations as an array
  loading: boolean = false;
  error: string | null = null;
  diagnosisId: string | null = null;
  symptoms:string[] = [];
  Role : string | null = null ;
  isdoctor = false ; // see if it is a doctor or not 
  comment: string | null = null;
  doctorComment: string = ''; 
  recommandationId :  string | null = null;

  constructor(
    private route: ActivatedRoute,
    private recommendationService: PrecautionserviceService,
    private router: Router,
    private authService: AuthService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    // Get the diagnosis_id from the route parameters
    this.diagnosisId = this.route.snapshot.paramMap.get('diagnosis_id');
    
    // If diagnosis_id exists, fetch recommendations
    if (this.diagnosisId) {
      this.getRecommendation(this.diagnosisId);
    }
    // // get user role from the token 
    this.Role = this.authService.getRoleFromToken()
    console.log("the role of the user is ", this.Role);
    if (this.Role?.toLowerCase() === 'doctor') {
      this.isdoctor = true;
  }
  }

  getRecommendation(diagnosisId: string): void {
    this.loading = true;
    this.error = null;
    this.recommendationService.getRecommendations(diagnosisId)
      .subscribe(
        (response) => {
          console.log(response);  // Add this to check the structure
          // Store diagnosis data
          this.diagnosisData = {
            id: response.diagnosis_id,
            description: response.diagnosis_description,
            date: response.diagnosis_date,
            confidence: response.diagnosis_confidence,
            symptoms:response.symptoms
          };
          if (this.diagnosisData.symptoms) {
            this.diagnosisData.symptoms = JSON.parse(this.diagnosisData.symptoms);
          }
          

          // Handle precautions (split if it's a string)
          const precautions = response.precautions.details;
          this.comment = response.precautions.doctor_comment;
          this.recommandationId = response.precautions.id;

          if (typeof precautions === 'string') {
            // Split the string into an array of recommendations
            this.recommendationsData = precautions.split(';').map((item) => item.trim());
          } else {
            this.recommendationsData = precautions; // If it's already an array, use it directly
          }
          
          this.loading = false;
        },
        (error) => {
          this.error = 'An error occurred while fetching the recommendations.';
          this.loading = false;
        }
      );
  }
  goBack(): void {
    this.router.navigate(['../']);  // This will navigate the user to the previous page
  }
  submitComment() {
    if (this.doctorComment) {
      // Make an API call to update the recommendation with the doctor's comment
      const requestPayload = {
        comment: this.doctorComment
      };
  
      this.http.post(`http://localhost:8000/api/updaterecommandation/${this.recommandationId}`, requestPayload)
        .subscribe(
          (response) => {
            console.log('Comment updated successfully', response);
            // Show success alert
            alert('Comment added successfully!');
            // Refresh the page
            window.location.reload();
          },
          (error) => {
            console.error('Error updating comment', error);
            alert('Failed to add the comment. Please try again.');
          }
        );
    } else {
      alert('Please provide a comment before submitting.');
    }
  }
  
}
