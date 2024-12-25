import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SignInComponent } from './Components/sign-in/sign-in.component';
import { SignUpComponent } from './Components/sign-up/sign-up.component';
import { FooterComponent } from './Components/footer/footer.component';
import { HeaderComponent } from './Components/header/header.component';
import { HomeComponent } from './Components/home/home.component';
import { DoctorsComponent } from './Components/doctors/doctors.component';
import { DepartmentsComponent } from './Components/departments/departments.component';
import { ContactComponent } from './Components/contact/contact.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ProfileComponent } from './Components/profile/profile.component';
import { EditProfileComponent } from './Components/edit-profile/edit-profile.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MapComponent } from './Components/map/map.component';
import { OAuthModule } from 'angular-oauth2-oidc';
import { SocialLoginModule, SocialAuthServiceConfig,GoogleSigninButtonModule } from '@abacritt/angularx-social-login';
import {
  GoogleLoginProvider,
} from '@abacritt/angularx-social-login'; 
import { DiagnosisComponent } from './Components/diagnosis/diagnosis.component';
import { FormsModule } from '@angular/forms';
import { MedicalHistoryComponent } from './Components/medical-history/medical-history.component';
import { PrecautionComponent } from './Components/precaution/precaution.component';
import { PatientListComponent } from './Components/patient-list/patient-list.component';
@NgModule({
  declarations: [
    AppComponent,
    SignInComponent,
    SignUpComponent,
    FooterComponent,
    HeaderComponent,
    HomeComponent,
    DoctorsComponent,
    DepartmentsComponent,
    ContactComponent,
    ProfileComponent,
    EditProfileComponent,
    MapComponent,
    DiagnosisComponent,
    MedicalHistoryComponent,
    PrecautionComponent,
    PatientListComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatSnackBarModule, 
    SocialLoginModule,
    GoogleSigninButtonModule,
    FormsModule,
    OAuthModule.forRoot() // Initialize OAuth


    
  ],
  providers: [ {
    provide: 'SocialAuthServiceConfig',
    useValue: {
      autoLogin: false,
      providers: [
        {
          id: GoogleLoginProvider.PROVIDER_ID,
          provider: new GoogleLoginProvider(
            '743131499790-sso6hkgri5gvi51e5kukojph0p64sp0l.apps.googleusercontent.com'
          )
        },
      ],
      onError: (err) => {
        console.error(err);
      }
    } as SocialAuthServiceConfig,
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }