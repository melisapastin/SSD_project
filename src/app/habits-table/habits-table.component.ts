import { Component, Input, Output, EventEmitter } from '@angular/core';
import { getFirestore, doc, deleteDoc } from 'firebase/firestore';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-habits-table',
  imports: [CommonModule],
  templateUrl: './habits-table.component.html',
  styleUrls: ['./habits-table.component.css'],
})
export class HabitsTableComponent {
  @Input() habits: any[] = [];
  @Output() habitDeleted = new EventEmitter<void>();
  private firestore = getFirestore(); // Initialize Firestore

  deleteHabit(habitId: string): void {
    const habitDocRef = doc(this.firestore, `habits/${habitId}`);
    deleteDoc(habitDocRef)
      .then(() => {
        alert('Habit deleted successfully!');
        this.habitDeleted.emit();
      })
      .catch(error => {
        console.error('Error deleting habit:', error);
        alert('Failed to delete habit.');
      });
  }
}
