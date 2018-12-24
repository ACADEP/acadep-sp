import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from "rxjs";
import { map } from 'rxjs/operators';
import { User } from "../models/user";



@Injectable({
  providedIn: 'root'
})


export class UsersService {
  usersCollection: AngularFirestoreCollection<any>;
  projectssCollection: AngularFirestoreCollection<any>;
  users: Observable<User[]>;
  projects: Observable<any[]>;
  userDoc;

  public delete: any;
  constructor(private db: AngularFirestore) {

   
  }

  // getProyect($key){
  //   return new Promise((resolve, reject) => {
  //     this.firebase.database.ref('users/' + $key).once('value')
  //     .then(res => resolve(res.val()),
  //       err => reject(err));
  //   });
  //   }

  getUsers() {

    this.usersCollection = this.db.collection('users');
    this.users = this.usersCollection.snapshotChanges().pipe(map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as User;
        data.id = a.payload.doc.id;
        return data;
      });
    }));

    return this.users;
  }


  getUserProjects(user_id) {

    this.projectssCollection = this.db.collection('projects',  ref => ref.where('administrators.'+user_id, '==', true) );
    this.projects = this.projectssCollection.snapshotChanges().pipe(map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as User;
        data.id = a.payload.doc.id;
        return data;
      });
    }));

    return this.projects;
  }

  saveUser( name: string, email: string, rol: string, id?: string,) {
    this.db.collection('users').doc(id).set({
      id: id,
      name: name,
      email: email,
      rol: rol,
    }).then(function (docRef) {
      return docRef;
    }).catch(function (error) {
      console.log(error);

    })
  }


  userExists(id: string) {
    return this.db.collection('users', ref => ref.where('id', '==', id)).get();
  }

  updateUser(user:User){

    this.userDoc = this.db.doc(`users/${user.id}`) ;
    this.userDoc.update(user);
  }




}
