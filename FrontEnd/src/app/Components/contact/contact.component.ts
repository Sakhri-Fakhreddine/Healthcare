import { Component } from '@angular/core';
import emailjs from 'emailjs-com';  // Import the emailjs library

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {

  // Form data variables
  name: string = '';
  email: string = '';
  subject: string = '';
  message: string = '';

  // Form submission handler (called by button click)
  submitForm() {
    // Validate form fields
    if (!this.name || !this.email || !this.subject || !this.message) {
      alert("Please fill out all the fields.");
      return;
    }

    // Create a form data object
    const formData = {
      name: this.name,
      email: this.email,
      subject: this.subject,
      message: this.message
    };
    console.log("the data input",formData);

    // Send the email using EmailJS
    emailjs.send('service_1gmtfs8', 'template_a46dudc', formData, 'Sbtqg58Gqw5cmJZD8')
      .then((response: any) => {
        console.log('Success:', response);
        alert('Your message has been sent successfully!');
        // Reset the form after submission
        this.name = '';
        this.email = '';
        this.subject = '';
        this.message = '';
      })
      .catch((error: any) => {
        console.error('Error:', error);
        alert('Oops, something went wrong. Please try again.');
      });
  }
}
