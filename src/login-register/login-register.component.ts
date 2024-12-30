import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirebaseService } from '../app/services/firebase.service';
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

  constructor(private fb: FormBuilder, private firebaseService: FirebaseService) {
    // Initialize the login form
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

    // Initialize the register form
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

  loginUser() {
    const { email, password } = this.loginForm.value;
    this.firebaseService.loginUser(email, password)
      .then(() => {
        console.log('Login successful');
        window.location.href = 'dashboard.html';
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
        window.location.href = 'dashboard.html';
      })
      .catch((error) => {
        console.error('Registration failed:', error.message);
        alert('Registration failed: ' + error.message);
      });
  }
}
