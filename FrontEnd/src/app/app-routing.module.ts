import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignInComponent } from './Components/sign-in/sign-in.component';
import { SignUpComponent } from './Components/sign-up/sign-up.component';
import { DoctorsComponent } from './Components/doctors/doctors.component';
import { DepartmentsComponent } from './Components/departments/departments.component';
import { ContactComponent } from './Components/contact/contact.component';
import { HomeComponent } from './Components/home/home.component';
import { ProfileComponent } from './Components/profile/profile.component';
import { EditProfileComponent } from './Components/edit-profile/edit-profile.component';
import { HeaderComponent } from './Components/header/header.component';
import { MapComponent } from './Components/map/map.component';
import { DiagnosisComponent } from './Components/diagnosis/diagnosis.component';
import { MedicalHistoryComponent } from './Components/medical-history/medical-history.component';
import { PrecautionComponent } from './Components/precaution/precaution.component';
import { PatientListComponent } from './Components/patient-list/patient-list.component';

const routes: Routes = [
  {path :"signin", component: SignInComponent},
  {path:"signup", component:SignUpComponent},
  {path:"doctor", component:DoctorsComponent},
  {path:"department", component:DepartmentsComponent},
  {path:"contact", component:ContactComponent},
  {path:"", component:HomeComponent},
  {path:"profile", component:ProfileComponent},
  {path:"edit-profile", component: EditProfileComponent},
  {path:"header", component:HeaderComponent},
  {path:"map", component:MapComponent},
  {path:"check_service", component:DiagnosisComponent},
  {path:"medical-history", component: MedicalHistoryComponent },
  {path:'precaution/:diagnosis_id', component: PrecautionComponent },
  {path:"patients-list", component: PatientListComponent },
  { path: "medical-history/:id/:name", component: MedicalHistoryComponent },
  {path:'updaterecommandation/:recommandation_id', component: PrecautionComponent },

  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
  
 }
