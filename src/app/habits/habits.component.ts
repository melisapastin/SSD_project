import { Component, OnInit } from '@angular/core';
import { Firestore, collection, query, where, getDocs, addDoc, doc, deleteDoc } from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HabitsTableComponent } from '../habits-table/habits-table.component';
import { AsyncPipe, CommonModule } from '@angular/common';

@Component({
  selector: 'app-habits',
  templateUrl: './habits.component.html',
  imports: [
    CommonModule,
    HabitsTableComponent,
    AsyncPipe,
  ],
  styleUrls: ['./habits.component.css']
})
export class HabitsComponent implements OnInit {
  habits$: Observable<any[]> | null = null;
  errorMessage: string | null = null;

  constructor(private firestore: Firestore) {}

  ngOnInit(): void {
    this.loadHabits();
  }

  private loadHabits() {
    try {
      // Reference the 'habits' collection
      const habitsCollection = collection(this.firestore, 'habits');
      const habitsQuery = query(habitsCollection, where('status', '==', 'active')); // Example query

      // Use from() to convert Promise to Observable, and map to transform data
      this.habits$ = from(getDocs(habitsQuery)).pipe(
        map(snapshot =>
          snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }))
        )
      );
    } catch (error) {
      this.errorMessage = 'Failed to load habits.';
      console.error('Error loading habits:', error);
    }
  }

  async addHabit() {
    const habitName = prompt('Enter habit name:');
    const frequency = prompt('Enter habit frequency (e.g., daily, weekly, monthly):');
    if (habitName && frequency) {
      try {
        const habitsCollection = collection(this.firestore, 'habits');
        await addDoc(habitsCollection, { name: habitName, status: 'active', createdAt: new Date(), frequency });
        alert('Habit added successfully!');
        this.loadHabits();
      } catch (error) {
        console.error('Error adding habit:', error);
        alert('Failed to add habit. Please try again.');
      }
    }
  }

  async deleteHabit(habitId: string) {
    try {
      const habitDocRef = doc(this.firestore, `habits/${habitId}`);
      await deleteDoc(habitDocRef);
      alert('Habit deleted successfully!');
      this.loadHabits();
    } catch (error) {
      console.error('Error deleting habit:', error);
      alert('Failed to delete habit. Please try again.');
    }
  }
}
