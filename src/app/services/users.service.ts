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

        // console.log(data.name);
        return data;
      });
    }));

    return this.users;
  }


  getUserProjects(user_id) {

    this.projectssCollection = this.db.collection('projects',  ref => ref.where('administrators.'+user_id, '==', true) );
    this.projects = this.projectssCollection.snapshotChanges().pipe(map(actions => {
      return actions.map(a => {

        console.log(a);
        const data = a.payload.doc.data() as User;
        data.id = a.payload.doc.id;
        return data;
      });
    }));

    return this.projects;
  }

  saveUser( user : User, role : boolean) {

    return new Promise((resolve, rejected) => {

      this.db.collection('users').doc(user.id).set({
        id: user.id,
        name: user.name,
        email: user.email,
        role: {
          administrator :role
        },
      }).then( (doc) => {
        resolve('done')
      }).catch((error) => {
        rejected(error)
  
      })
    })

   

  }


  userExists(id: string) {
    return this.db.collection('users', ref => ref.where('id', '==', id)).get();
  }

 

  updateUser(user: User, role: boolean) {

  //  console.log(role)

    return new Promise ((resolve, reject) => {
      this.db.collection('users').doc(user.id).update({
       name : user.name,
       email : user.email,
       role :{
         administrator :role
       }

      }).then((res:any) => resolve(res), err => reject(err));
    })
  }



}
