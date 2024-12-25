

import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { DiagnosisService } from 'src/app/services/diagnosis-service.service';
import { AuthService } from 'src/app/services/auth.service';  // Assuming you have an AuthService

@Component({
  selector: 'app-diagnosis',
  templateUrl: './diagnosis.component.html',
  styleUrls: ['./diagnosis.component.css']
})
export class DiagnosisComponent implements OnInit {
  clientName: string | null = null;  // Will hold the authenticated user's username
  date: string = '';  // Will hold the current date
  // All symptoms categorized for better readability
  symptomCategories: { [category: string]: string[] } = {
    "Mental Health": [
      'anxiety and nervousness', 'depression', 'depressive or psychotic symptoms', 'hostile behavior',
      'temper problems', 'excessive anger', 'fears and phobias', 'low self-esteem'
    ],
    "Respiratory Symptoms": [
      'shortness of breath', 'sharp chest pain', 'chest tightness', 'breathing fast', 'cough',
      'nasal congestion', 'hoarse voice', 'throat swelling', 'difficulty speaking',
      'difficulty breathing', 'wheezing', 'congestion in chest'
    ],
    "Cardiovascular Symptoms": [
      'palpitations', 'irregular heartbeat', 'decreased heart rate', 'increased heart rate',
      'peripheral edema', 'chest tightness', 'sharp chest pain', 'rib pain'
    ],
    "Neurological Symptoms": [
      'dizziness', 'insomnia', 'fainting', 'seizures', 'headache', 'slurring words',
      'loss of sensation', 'paresthesia', 'focal weakness', 'disturbance of memory'
    ],
    "Gastrointestinal Symptoms": [
      'vomiting', 'nausea', 'diarrhea', 'constipation', 'stomach bloating', 'upper abdominal pain',
      'sharp abdominal pain', 'burning abdominal pain', 'abdominal distention', 'flatulence'
    ],
    "Urinary & Reproductive Symptoms": [
      'painful urination', 'frequent urination', 'blood in urine', 'vaginal itching',
      'vaginal dryness', 'vaginal discharge', 'intermenstrual bleeding', 'scanty menstrual flow',
      'absence of menstruation', 'long menstrual periods', 'irregular menstruation',
      'painful menstruation', 'frequent menstruation', 'infertility'
    ],
    "Musculoskeletal Symptoms": [
      'joint pain', 'muscle pain', 'back pain', 'neck pain', 'shoulder pain', 'knee pain',
      'foot or toe pain', 'elbow pain', 'hip pain', 'hand or finger pain'
    ],
    "Dermatological Symptoms": [
      'skin rash', 'acne or pimples', 'itching of skin', 'abnormal appearing skin',
      'skin lesion', 'dry lips', 'skin moles', 'bumps on skin', 'skin dryness'
    ],
    "Other Symptoms": [
      'fever', 'fatigue', 'weight gain', 'recent weight loss', 'blurred vision',
      'hearing loss', 'frequent urination', 'feeling ill', 'irritability', 'ringing in ear'
    ]
  };

  selectedSymptoms: string[] = [];
  diagnosisResult: { diagnosis: string; confidence: number; date: Date; diagnosis_id: number } | null = null;
  userId: number | null = null; // Authenticated user's ID
  showDiagnosisResult = false;

  // Track expanded categories
  expandedCategories: Set<string> = new Set();

  constructor(
    private diagnosisService: DiagnosisService,
    private authService: AuthService, // To get the user's authentication data
    private changeDetectorRef: ChangeDetectorRef // For manually triggering change detection
  ) {}

  ngOnInit(): void {
    // Get the authenticated user's data and the current date
    this.clientName = this.authService.getNameFromToken();
    this.date = new Date().toISOString().split('T')[0];
    this.userId = this.authService.getUserId();
  }

  toggleSymptom(symptom: string, event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;

    if (isChecked) {
      this.selectedSymptoms.push(symptom);
    } else {
      this.selectedSymptoms = this.selectedSymptoms.filter((s) => s !== symptom);
    }

    console.log('Selected Symptoms:', this.selectedSymptoms);
  }

  onSubmit(): void {
    if (this.selectedSymptoms.length === 0) {
      alert('Please select at least one symptom.');
      return;
    }
  
    if (this.userId === null || typeof this.userId !== 'number') {
      alert('Please sign in or sign up to make diagnosis.');
      return;
    }
  
    const diagnosisData = {
      user: this.userId,
      symptoms: this.selectedSymptoms,
      diagnosis_description: this.diagnosisResult?.diagnosis || 'No diagnosis available',
      diagnosis_date: this.date,
    };
  
    this.diagnosisService.createDiagnosis(diagnosisData).subscribe(
      (result) => {
        this.diagnosisResult = result;
        console.log('Diagnosis Created (inside subscribe):', this.diagnosisResult);
        alert('Diagnosis created successfully!');
  
        // Trigger change detection to update the DOM
        this.changeDetectorRef.detectChanges();
        this.showDiagnosisResult = true;
  
        // Scroll to the diagnosis result
        const diagnosisResultElement = document.getElementById('diagnosisResult');
        if (diagnosisResultElement) {
          diagnosisResultElement.scrollIntoView({ behavior: 'smooth' });
        }
      },
      (error) => {
        console.error('Error creating diagnosis:', error);
      }
    );
  }
  // Toggle the expansion of a category
  toggleCategory(categoryKey: string): void {
    if (this.expandedCategories.has(categoryKey)) {
      this.expandedCategories.delete(categoryKey);
    } else {
      this.expandedCategories.add(categoryKey);
    }
  }

  // Check if a category is expanded
  isCategoryExpanded(categoryKey: string): boolean {
    return this.expandedCategories.has(categoryKey);
  }
}
