import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { User as FirebaseUser } from '@angular/fire/auth';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../app/services/auth.service';
import { Router } from '@angular/router';
import { CommonModule, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Import FormsModule for [(ngModel)]

@Component({
  selector: 'app-login-register',
  standalone: true,
  imports: [FormsModule, NgClass, CommonModule, ReactiveFormsModule],
  templateUrl: './login-register.component.html',
  styleUrls: ['./login-register.component.css'],
})
export class LoginRegisterComponent implements OnInit {
  showLogin: boolean = true;
  user$!: Observable<FirebaseUser | null>;
  loginForm: FormGroup;
  registerForm: FormGroup;
  message: string = '';
  isLoginVisible: boolean = true;
  isRegisterVisible: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
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

  ngOnInit(): void {
    this.user$ = this.authService.getUser(); // Listen for the currently logged-in user
  }

  showLoginForm(): void {
    this.isLoginVisible = true;
    this.isRegisterVisible = false;
  }

  showRegisterForm(): void {
    this.isLoginVisible = false;
    this.isRegisterVisible = true;
  }

  getWrapperClass(): string {
    return this.isLoginVisible || this.isRegisterVisible ? 'active' : '';
  }

  onLogin(): void {
    if (this.loginForm.invalid) {
      this.showMessage('Please fill in all fields correctly.', 'loginMessage');
      return;
    }

    const { email, password } = this.loginForm.value;

    this.authService
      .loginUser(email, password)
      .toPromise()
      .then(() => {
        console.log('Login successful');
        this.router.navigate(['/dashboard']);
      })
      .catch((error: { message: string }) => {
        console.error('Login failed:', error.message);
        this.showMessage(`Login failed: ${error.message}`, 'loginMessage');
      });
  }

  onRegister(): void {
    if (this.registerForm.invalid) {
      this.showMessage('Please fill in all fields correctly.', 'registerMessage');
      return;
    }

    const { username, email, password } = this.registerForm.value;

    this.authService
      .registerUser(email, password)
      .toPromise()
      .then(() => {
        console.log('Registration successful');
        this.router.navigate(['/dashboard']);
      })
      .catch((error: { message: string }) => {
        console.error('Registration failed:', error.message);
        this.showMessage(`Registration failed: ${error.message}`, 'registerMessage');
      });
  }
  loginWithGoogle(): void {
    this.authService
      .loginWithGoogle()
      .then((user) => {
        if (user) {
          console.log('User logged in with Google:', user);
          this.router.navigate(['/dashboard']);
        } else {
          console.warn('No user was returned after login.');
        }
      })
      .catch((error: { message: string }) => {
        console.error('Google Login Error:', error.message);
        this.showMessage(`Login failed: ${error.message}`, 'error-div');
      });
  }

  registerWithGoogle(): void {
    this.authService
      .loginWithGoogle()
      .then((user) => {
        if (user) {
          console.log('User logged in with Google:', user);
          this.router.navigate(['/dashboard']);
        } else {
          console.warn('No user was returned after login.');
        }
      })
      .catch((error: { message: string }) => {
        console.error('Google Registration Error:', error.message);
        this.showMessage(`Registration failed: ${error.message}`, 'registerMessage');
      });
  }

  showMessage(message: string, divId: string): void {
    const messageDiv = document.getElementById(divId);
    if (messageDiv) {
      messageDiv.style.display = 'block';
      messageDiv.innerHTML = message;
      messageDiv.style.opacity = '1';
      setTimeout(() => {
        messageDiv.style.opacity = '0';
      }, 5000); // Fade out message after 5 seconds
    }
  }
}
