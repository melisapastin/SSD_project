import { Component } from '@angular/core';
import { Functions, httpsCallable } from '@angular/fire/functions';

@Component({
  selector: 'app-habits',
  templateUrl: './habits.component.html',
  styleUrls: ['./habits.component.css']
})
export class HabitsComponent {

  constructor(private functions: Functions) {}

  // Method to trigger sending email
  sendEmail() {
    // Call Firebase Cloud Function
    const sendEmailCallable = httpsCallable(this.functions, 'sendEmail');
    sendEmailCallable({ to: 'melisa.pastin@student.upt.ro' }) // Replace with the recipient's email
      .then((result) => {
        console.log('Email sent successfully:', result);
      })
      .catch((error) => {
        console.error('Error sending email:', error);
      });
  }
}
