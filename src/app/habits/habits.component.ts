import { Component, OnInit } from '@angular/core';
import { getFirestore, collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import {AsyncPipe, CommonModule} from '@angular/common';
import { HabitsTableComponent } from '../habits-table/habits-table.component';

@Component({
  selector: 'app-habits',
  templateUrl: './habits.component.html',
  styleUrls: ['./habits.component.css'],
  imports: [
    AsyncPipe,
    HabitsTableComponent,
    CommonModule
  ]
})
export class HabitsComponent implements OnInit {
  habits$: Observable<any[]> | null = null;
  errorMessage: string | null = null;
  private firestore = getFirestore(); // Initialize Firestore

  ngOnInit(): void {
    this.loadHabits();
  }

  private loadHabits(): void {
    const habitsCollection = collection(this.firestore, 'habits');
    const habitsQuery = query(habitsCollection, where('status', '==', 'active'));

    this.habits$ = from(getDocs(habitsQuery)).pipe(
      map(snapshot =>
        snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }))
      )
    );
  }

  addHabit(): void {
    const habitName = prompt('Enter habit name:');
    const frequency = prompt('Enter habit frequency (e.g., daily, weekly, monthly):');
    if (habitName && frequency) {
      const habitsCollection = collection(this.firestore, 'habits');
      addDoc(habitsCollection, { name: habitName, status: 'active', createdAt: new Date(), frequency })
        .then(() => {
          alert('Habit added successfully!');
          this.loadHabits();
        })
        .catch(error => {
          console.error('Error adding habit:', error);
          alert('Failed to add habit.');
        });
    }
  }

  onHabitDeleted(): void {
    this.loadHabits();
  }

  sendEmail(): void {
    // Placeholder for email sending functionality
    alert('Email feature coming soon!');
  }
}
