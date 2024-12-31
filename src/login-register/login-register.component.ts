import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirebaseService } from '../app/services/firebase.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login-register',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login-register.component.html',
  styleUrls: ['./login-register.component.css']
})
export class LoginRegisterComponent {
  showLogin: boolean = true;
  showRegister: boolean = false;

  loginForm: FormGroup;
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private firebaseService: FirebaseService,
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

  loginUser() {
    const { email, password } = this.loginForm.value;
    this.firebaseService.loginUser(email, password)
      .then(() => {
        console.log('Login successful');
        this.router.navigate(['/dashboard']);  // Navigate to the dashboard
      })
      .catch((error) => {
        console.error('Login failed:', error.message);
        alert('Login failed: ' + error.message);
      });
  }

  registerUser() {
    const { username, email, password } = this.registerForm.value;
    this.firebaseService.registerUser(username, email, password)
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
