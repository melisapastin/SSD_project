import { Component, Input } from '@angular/core';
import { Firestore, doc, deleteDoc } from '@angular/fire/firestore';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-habits-table',
  templateUrl: './habits-table.component.html',
  styleUrls: ['./habits-table.component.css'],
  imports: [CommonModule]
})
export class HabitsTableComponent {
  @Input() habits: any[] = [];

  constructor(private firestore: Firestore) {}

  async deleteHabit(habitId: string) {
    try {
      const habitDocRef = doc(this.firestore, `habits/${habitId}`);
      await deleteDoc(habitDocRef);
      alert('Habit deleted successfully!');

    } catch (error) {
      console.error('Error deleting habit:', error);
      alert('Failed to delete habit. Please try again.');
    }
  }

}
