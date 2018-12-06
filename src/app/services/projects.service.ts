import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {  project } from "../models/project";




@Injectable({
  providedIn: 'root'
})
export class ProjectsService {
  projectsCollection: AngularFirestoreCollection<project>;
  projects: Observable<project[]>;
  projectDoc;

  // userList: AngularFireList<any>;
  // public algo: any;

// projectList : AngularFireList<any>;
  constructor(    
    private db: AngularFirestore
    ) { }


    getProjects() {

      this.projectsCollection = this.db.collection('projects');
      this.projects = this.projectsCollection.snapshotChanges().pipe(map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data() as project;
          data.id = a.payload.doc.id;
          return data;
        });
      }));
  
      return this.projects; 
    }

    saveProject( project: project) {
      this.db.collection('users').doc(project.id).set({
        id: project.id,
        name: project.name,
        start: project.start,
        end: project.end,
      }).then(function (docRef) {
        return docRef;
      }).catch(function (error) {
        console.log(error);
  
      })
    }

    // getProjects()
    // {
    //   this.projectList = this.firebase.list('projects');
    //   return this.projectList;
    //   // return this.firebase.database.ref().child('projects');
     
    // }

    // getUsers()
    // {
    //   this.userList = this.firebase.list('users');
    //   return this.userList;
    //   // return this.firebase.database.ref().child('projects');
     
    // }

    // addProject(name:string, description:string, ubication:string, inicio:string, final:string, administrador: string){
    //   this.projectList.push({
    //     name: name,
    //     description: description,
    //     ubication: ubication,
    //     inicio: inicio,
    //     final:final,
    //     administrator:administrador,
    //   })
    // }

    // updateproject($key:string, name:string, description:string, ubication:string, inicio:string, final:string){

    //   this.firebase.database.ref('projects/'+ $key).set({
    //     name: name,
    //     description: description,
    //     ubication: ubication,
    //     inicio: inicio,
    //     final:final
    //   })
    // }

    // removeproject($key){
    //   this.projectList.remove($key)
    // }

    // getProyect($key){
    //   return new Promise((resolve, reject) => {
    //     this.firebase.database.ref('projects/' + $key).once('value')
    //     .then(res => resolve(res.val()),
    //       err => reject(err));
    //   });
    //   }

      // this.firebase.database.ref('projects/' + $key).once('value').then((result) => {
      //   var proyect = result.val();
      //   console.log(proyect);
      // }).catch((err) => {
      //   console.log(err);
      // });
    
}
