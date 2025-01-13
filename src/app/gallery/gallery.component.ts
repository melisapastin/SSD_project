import { Component, OnInit } from '@angular/core';
import { getStorage, ref, uploadBytes, getDownloadURL, listAll } from "firebase/storage";
import { v4 as uuidv4 } from 'uuid';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { getAuth } from 'firebase/auth';

@Component({
  selector: 'app-gallery',
  imports: [CommonModule],
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent implements OnInit {
  galleryItems: string[] = []; // Array to store image URLs
  userId: string | null = null; // Store user UID for consistency

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.getUser().subscribe(user => {
      if (user) {
        this.userId = user.uid;
        this.loadGallery(); // Load gallery once the user is logged in
      } else {
        console.log('No user logged in');
      }
    });
  }

  // Upload file to Firebase Storage
  async uploadFile(event: any) {
    const file = event.target.files[0];
    if (!file || !this.userId) return;

    const storage = getStorage();
    const fileName = `users/${this.userId}/images/${uuidv4()}_${file.name}`;
    const storageRef = ref(storage, fileName);

    try {
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      this.galleryItems.push(downloadURL); // Add the image URL to the gallery
      alert('File uploaded successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload file.');
    }
  }

  // Load images from Firebase Storage for the current user
  async loadGallery() {
    if (!this.userId) {
      console.log('User ID is missing.');
      return;
    }

    const storage = getStorage();
    const galleryRef = ref(storage, `users/${this.userId}/images`);

    try {
      const result = await listAll(galleryRef);
      const urls = await Promise.all(result.items.map(item => getDownloadURL(item)));
      this.galleryItems = urls; // Update gallery items with new image URLs
    } catch (error) {
      console.error('Failed to load gallery:', error);
    }
  }

  protected readonly document = document;
}
