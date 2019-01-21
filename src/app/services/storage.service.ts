import { Injectable } from '@angular/core';
// import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from "@angular/fire/storage";


@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(public storage: AngularFireStorage) { 

   }


   download(reference){
     this.storage.ref(reference).getDownloadURL()
   }
}
