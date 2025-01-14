import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, doc, deleteDoc, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  constructor(private firestore: Firestore) {}

  // Add a document
  addDocument(collectionName: string, data: any): Promise<void> {
    const col = collection(this.firestore, collectionName);
    return addDoc(col, data) as unknown as Promise<void>;
  }

  // Get documents from a collection
  getCollection(collectionName: string): Observable<any[]> {
    const col = collection(this.firestore, collectionName);
    return collectionData(col, { idField: 'id' }) as Observable<any[]>;
  }

  // Delete a document
  deleteDocument(collectionName: string, docId: string): Promise<void> {
    const document = doc(this.firestore, `${collectionName}/${docId}`);
    return deleteDoc(document);
  }
}
