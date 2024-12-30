import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';  // Import the Firebase app module
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'; // Import Firebase auth
import { getFirestore, setDoc, doc } from 'firebase/firestore'; // Import Firestore

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private firebaseConfig = {
    apiKey: 'AIzaSyCusRVPdwmkplSzqcg19u4rf-w-wOx5ek4',
    authDomain: 'ssdproject-23aa9.firebaseapp.com',
    projectId: 'ssdproject-23aa9',
    storageBucket: 'ssdproject-23aa9.firebasestorage.app',
    messagingSenderId: '267112903416',
    appId: '1:267112903416:web:99d74d76c0ca21ef58410d',
    measurementId: 'G-WCEPFMP510'
  };

  private app = initializeApp(this.firebaseConfig); // Initialize Firebase app
  private db = getFirestore(this.app); // Initialize Firestore

  constructor() {}

  registerUser(username: string, email: string, password: string): Promise<void> {
    const auth = getAuth(this.app); // Get Firebase Auth instance
    return createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        const userData = { username, email };
        const docRef = doc(this.db, 'users', user.uid);
        return setDoc(docRef, userData);
      });
  }

  loginUser(email: string, password: string): Promise<any> {
    const auth = getAuth(this.app);
    return signInWithEmailAndPassword(auth, email, password);
  }
}
