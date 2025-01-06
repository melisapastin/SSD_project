import { Injectable } from '@angular/core';

import firebase from 'firebase/compat/app'; // Import Firebase types

import { Auth, signInWithPopup, GoogleAuthProvider, User } from '@angular/fire/auth';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor( private auth: Auth) {}

  // Login with Google
  async loginWithGoogle(): Promise<User | null> {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(this.auth, provider);
      return result.user;  // Return the authenticated user
    } catch (error) {
      console.error('Google Login Error:', error);
      return null; // Return null in case of error
    }
  }

  // Logout
  async logout(): Promise<void> {
    try {
      await this.auth.signOut();
    } catch (error) {
      console.error('Logout Error:', error);
    }
  }
  async loginUser(email: string, password: string): Promise<void> {
    console.warn('AuthService.loginUser() is not yet implemented.');
    return new Promise((resolve, reject) => {
      // Simulate a success/failure scenario using setTimeout
      setTimeout(() => {
        console.log(`Placeholder: Attempting to log in user with email: ${email}`);
        resolve(); // Simulating a resolved Promise
      }, 1000); // Simulates an asynchronous login process
    });
  }

  // Placeholder for registerUser function
  async registerUser(username: string, email: string, password: string): Promise<void> {
    console.warn('AuthService.registerUser() is not yet implemented.');
    return new Promise((resolve, reject) => {
      // Simulate a success/failure scenario using setTimeout
      setTimeout(() => {
        console.log(`Placeholder: Attempting to register user with username: ${username} and email: ${email}`);
        resolve(); // Simulating a resolved Promise
      }, 1000); // Simulates an asynchronous registration process
    });
  }
  // Get the currently logged-in user (observable)
  getUser(): Observable<User | null> {
    return new Observable((observer) => {
      const unsubscribe = this.auth.onAuthStateChanged(
        (user) => observer.next(user),
        (error) => observer.error(error),
        () => observer.complete()
      );
      return { unsubscribe };
    });
  }
}
