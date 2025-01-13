// src/main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { importProvidersFrom } from '@angular/core';


import { firebaseConfig } from './firebase-config';
import { BrowserModule } from '@angular/platform-browser';
import { routes} from './app/app.routes';
import {getApp, provideFirebaseApp} from '@angular/fire/app';
import {provideAuth} from '@angular/fire/auth';
import {getAuth} from 'firebase/auth';
import {initializeApp} from 'firebase/app';
import { provideFunctions, getFunctions } from '@angular/fire/functions';

console.log('Bootstrapping Angular...');
const app = initializeApp(firebaseConfig);
bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes), // Add your routes here if using RouterOutlet
    provideFirebaseApp(() => app),
    provideAuth(() => getAuth(app)),
    provideFunctions(() => getFunctions(app)),
    importProvidersFrom(BrowserModule),
  ],
}).catch(err => {
  console.error('Firebase initialization error:', err); // This catches other unforeseen issues.
});
