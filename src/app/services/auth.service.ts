import { Injectable } from '@angular/core';

import * as firebase from 'firebase/app';// Import Firebase types
import 'firebase/auth';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, User } from '@angular/fire/auth';
import {from, Observable} from 'rxjs';
import {getAuth} from 'firebase/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor( private auth: Auth) {}

  // Login with Google

  async loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    const auth = getAuth();

    provider.setCustomParameters({ prompt: 'select_account' }); // Force account selection

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Store user refresh token in a secure way
      if (user && user.refreshToken) {
        document.cookie = `google_token=${user.refreshToken}; SameSite=None; Secure`;
      }

      return user; // Return the user object
    } catch (error) {
      console.error('Google Login Error:', error);
      throw error; // Allow error handling in the calling function
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
  registerUser(email: string, password: string): Observable<any> {
    return from(createUserWithEmailAndPassword(this.auth, email, password));
  }

  loginUser(email: string, password: string): Observable<any> {
    return from(signInWithEmailAndPassword(this.auth, email, password));
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

  // Get the UID of the currently logged-in user
  getUserId(): string | null {
    const user = getAuth().currentUser;
    return user ? user.uid : null; // Return the UID or null if no user is logged in
  }
}
