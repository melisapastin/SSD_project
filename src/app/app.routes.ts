import { Routes } from '@angular/router';
import { LoginRegisterComponent } from '../login-register/login-register.component';
import { CommonModule } from '@angular/common';

export const routes: Routes = [
  { path: '', redirectTo: 'login-register', pathMatch: 'full' },
  { path: 'login-register', component: LoginRegisterComponent },
];
