import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { User as FirebaseUser } from '@angular/fire/auth';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../app/services/auth.service';
import { Router } from '@angular/router';
import {CommonModule, NgClass} from '@angular/common';
import { FormsModule } from '@angular/forms'; // Import FormsModule for [(ngModel)]

@Component({
  selector: 'app-login-register',
  standalone: true,
  imports: [FormsModule, NgClass , CommonModule],
  templateUrl: './login-register.component.html',
  styleUrls: ['./login-register.component.css']
    // Add FormsModule directly to component imports
})
export class LoginRegisterComponent  implements OnInit {
  showLogin: boolean = true;
  showRegister: boolean = false;
  user$!: Observable<FirebaseUser | null>;
  loginForm: FormGroup;
  registerForm: FormGroup;


  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router  // Inject Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  showLoginForm() {
    this.showLogin = true;
    this.showRegister = false;
  }

  showRegisterForm() {
    this.showRegister = true;
    this.showLogin = false;
  }

  getWrapperClass() {
    return this.showLogin || this.showRegister ? 'active' : '';
  }

  onLogin() {
    const email = (document.getElementById('loginEmail') as HTMLInputElement).value;
    const password = (document.getElementById('loginPassword') as HTMLInputElement).value;

    // Validate fields
    if (!email || !password) {
      this.showMessage('All fields are required!', 'loginMessage');
      return;
    } else {
      this.router.navigate(['/dashboard']);  // Navigate to dashboard after login
    }
    // Proceed with login (assuming Firebase authentication or custom login logic here)
    // your login logic here
  }

  onRegister() {
    const username = (document.getElementById('rUsername') as HTMLInputElement).value;
    const email = (document.getElementById('rEmail') as HTMLInputElement).value;
    const password = (document.getElementById('rPassword') as HTMLInputElement).value;
    if (password && !/^(?=.*[a-zA-Z])(?=.*\d).{6,}$/.test(password)) {
      this.showMessage('Password must be at least 6 characters long and contain both letters and digits.', 'registerMessage');
      return;
    }
    // Validate fields
    if (!username || !email || !password) {
      this.showMessage('All fields are required!', 'registerMessage');
      return;
    } else {
      this.router.navigate(['/dashboard']);  // Navigate to dashboard after registration
    }
    // Proceed with registration (assuming Firebase or your custom registration logic here)
    // your registration logic here
  }

  showMessage(message: string, divId: string) {
    const messageDiv = document.getElementById(divId);
    if (messageDiv) {
      messageDiv.style.display = "block";
      messageDiv.innerHTML = message; // Set the message content
      messageDiv.style.opacity = String(1);
      messageDiv.style.pointerEvents = "none"; // Prevent any interaction
    }
  }
  ngOnInit(): void {
    // Listen for the currently logged-in user
    this.user$ = this.authService.getUser();
  }
  loginWithGoogle(): void {
    this.authService
        .loginWithGoogle() // Consume the service
        .then(user => {
          if (user) {
            console.log('User logged in:', user);

            // Example: navigate to the dashboard or display a success message
            this.router.navigate(['/dashboard']);
          } else {
            // Handle cases where the user object is null
            console.warn('No user was returned after login.');
          }
        })
        .catch((error: { message: string }) => {
          console.error('Login Error:', error.message);
          this.showMessage('Login failed: ' + error.message, 'error-div');
        });
  }
 loginUser() {
    const { email, password } = this.loginForm.value;
    this.authService.loginUser(email, password)
      .then(() => {
        console.log('Login successful');
        this.router.navigate(['/dashboard']);  // Navigate to the dashboard
      })
      .catch((error: { message: string; }) => {
        console.error('Login failed:', error.message);
        alert('Login failed: ' + error.message);
      });
  }

  registerUser() {
    const { username, email, password } = this.registerForm.value;
    this.authService.registerUser(username, email, password)
      .then(() => {
        console.log('Registration successful');
        this.router.navigate(['/dashboard']);  // Navigate to the dashboard
      })
      .catch((error) => {
        console.error('Registration failed:', error.message);
        alert('Registration failed: ' + error.message);
      });
  }
}
