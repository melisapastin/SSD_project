// src/main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { importProvidersFrom } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { firebaseConfig } from './firebase-config';
import { BrowserModule } from '@angular/platform-browser';
import { routes} from './app/app.routes';
import {getApp, provideFirebaseApp,initializeApp} from '@angular/fire/app';
import {provideAuth} from '@angular/fire/auth';
import {getAuth} from '@angular/fire/auth';

import {getFirestore, provideFirestore} from '@angular/fire/firestore';

console.log('Bootstrapping Angular...');
bootstrapApplication(AppComponent,
  {
    providers: [
      importProvidersFrom(FormsModule),
      provideRouter(routes), // Add your routes here if using RouterOutlet
      provideFirebaseApp(() => {
        // Check if Firebase app is initialized
        try {
          const app = getApp();
          return app;
        } catch (error) {
          console.log('Firebase app not initialized, initializing...');
          return initializeApp(firebaseConfig);
        }
      }),
      provideAuth(() => getAuth()),
      importProvidersFrom(BrowserModule),
      provideFirestore(() => getFirestore()),
    ]
  }).catch(err => {
  console.error('Firebase initialization error:', err); // This catches other unforeseen issues.
});
