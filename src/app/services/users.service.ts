import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from "rxjs";
import { map } from 'rxjs/operators';

export interface user {
  id: string,
  name: string,
  role: string
}

@Injectable({
  providedIn: 'root'
})


export class UsersService {
  usersCollection: AngularFirestoreCollection<any>;
  users: Observable<user[]>;
  userDoc;

  public delete: any;
  constructor(private db: AngularFirestore) {
    this.usersCollection = this.db.collection('users');
    this.users = this.usersCollection.snapshotChanges().pipe(map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as user;
        data.id = a.payload.doc.id;
        return data;
      });
    }));
  }

  getUsers() {
    return this.users;
  }

  saveUser(id: string, name: string, email: string, rol: string) {
    this.db.collection('users').doc(id).set({
      id: id,
      name: name,
      email: email,
      rol: rol,
    }).then(function (docRef) {
      return docRef;
    }).catch(function (error) {
      console.log(id);

    })
  }


  userExists(id: string) {
    return this.db.collection('users', ref => ref.where('id', '==', id)).get();
  }




}
