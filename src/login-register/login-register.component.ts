import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import {getAdditionalUserInfo, User as FirebaseUser} from '@angular/fire/auth';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../app/services/auth.service';
import { Router } from '@angular/router';
import { CommonModule, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {getAuth, GoogleAuthProvider, signInWithPopup} from 'firebase/auth'; // Import FormsModule for [(ngModel)]

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

  loginWithGoogle() {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();

    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        const additionalUserInfo = getAdditionalUserInfo(result);

        if (!additionalUserInfo?.isNewUser) {
          // Existing user successfully logged in
          console.log('Existing user logged in:', user);
          this.router.navigate(['/dashboard']);
        } else {
          // Prevent new users from logging in here
          console.error('This account is not registered yet. Please register first.');
          this.showMessage('This account is not registered yet. Please register first.', 'loginMessage');
        }
      })
      .catch((error) => {
        console.error('Google Login Error:', error);
        this.showMessage(`Login failed: ${error.message}`, 'loginMessage');
      });
  }

  registerWithGoogle(): void {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();

    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        const additionalUserInfo = getAdditionalUserInfo(result);

        if (additionalUserInfo?.isNewUser) {
          // New user successfully registered
          console.log('New user registered with Google:', user);
          this.router.navigate(['/dashboard']);
        } else {
          // Prevent existing users from re-registering
          console.error('This account is already registered. Please log in instead.');
          this.showMessage('This account is already registered. Please log in instead.', 'registerMessage');
        }
      })
      .catch((error) => {
        console.error('Google Registration Error:', error);
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
