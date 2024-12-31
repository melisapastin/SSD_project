import { Routes } from '@angular/router';
import { LoginRegisterComponent } from '../login-register/login-register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { GalleryComponent } from './gallery/gallery.component';
import { HabitsComponent } from './habits/habits.component';


export const routes: Routes = [
  { path: '', redirectTo: 'login-register', pathMatch: 'full' },
  { path: 'login-register', component: LoginRegisterComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'gallery', component: GalleryComponent },
  { path: 'habits', component: HabitsComponent },
];
