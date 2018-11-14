import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import { promise } from 'protractor';
import { resolve } from 'dns';
import { reject } from 'q';
import { map } from "rxjs/operators";
// import { AngularFirestore } from  'angularfire2/firestore';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
// import { User } from '../modelos/users'
import { from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userList: AngularFireList<any>;

  constructor(
    public afAuth: AngularFireAuth,
    private firebase: AngularFireDatabase
  ) { }


  getusers() {

    return this.userList = this.firebase.list('Users')
  }

  registerUser(email: string, pass: string) {
    return new Promise((resolve, reject) => {
      this.afAuth.auth.createUserWithEmailAndPassword(email, pass)
        .then(userData => resolve(userData),
          err => reject(err));
    });
  }

  saveUser(uid: string, name: string, email: string, role: string) {
    this.firebase.database.ref('users/' + uid).set({
      name: name,
      email: email,
      role: role
    })
  }



  login(email: string, pass: string) {
    return new Promise((resolve, reject) => {
      this.afAuth.auth.signInWithEmailAndPassword(email, pass)
        .then(userData => resolve(userData),
          err => reject(err));
    });
  }


  getAuth() {
    return this.afAuth.authState.pipe(map(auth => auth));
  }



  logout() {
    return this.afAuth.auth.signOut();
  }
}

