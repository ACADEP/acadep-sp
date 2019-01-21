import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
// import * as firebase from 'firebase/app';
// import { promise } from 'protractor';
// import { resolve } from 'dns';
// import { reject } from 'q';
import { map } from "rxjs/operators";

import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';

// import { AngularFirestore } from  'angularfire2/firestore';
// import { User } from '../modelos/users'
// import { from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // userList: AngularFireList<any>;

  constructor(
    public afAuth: AngularFireAuth,
    private db: AngularFirestore
  ) { }


  // getusers() {

  //   return this.userList = this.firebase.list('Users')
  // }

  registerUser(email: string, pass: string) {
    return new Promise((resolve, reject) => {
      this.afAuth.auth.createUserWithEmailAndPassword(email, pass)
        .then(userData => resolve(userData),
          err => reject(err));
    });
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

 async getAdmin(uid) {

  var pass;

   await this.db.collection('users').doc(uid).ref.get().then((doc) => {
      if (doc.data().role.administrator == true) {
         pass = true;
        //  console.log('eres administrador')
      } else {
        pass = false;
        // console.log('eres un empleado')
      }
    }).catch((err) => {
      console.log('no existe documento')
    });
   
    return pass;
  }



  logout() {
    return this.afAuth.auth.signOut();
  }
}

