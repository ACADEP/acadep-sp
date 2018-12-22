import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { project } from "../models/project";
import { resolve, reject } from 'q';




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

    this.projectsCollection = this.db.collection('projects', ref => ref.where('deleted', '==', false));

    this.projects = this.projectsCollection.snapshotChanges().pipe(map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as project;
        data.id = a.payload.doc.id;
        return data;
      });
    }));

    return this.projects;
  }

  searchProjects(name:string)
  {
    this.projectsCollection = this.db.collection('projects', ref => ref.where('deleted', '==', false));
    this.projects = this.projectsCollection.snapshotChanges().pipe(map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as project;
        data.id = a.payload.doc.id;
        return data;
      });
    }));

    return this.projects;
  }

  saveProject(project: project) {

    return new Promise((resolve, reject) => {
      this.db.collection('projects').add({
    
        name: project.name,
        description: project.description,
        ubication: project.ubication,
        start: project.start,
        end: project.end,
        administrators: project.administrators,
        deleted : false,
      }).then((res: any) => resolve(res), err => reject(err));
    })


  }



  deleteProject(id:string){
    return new Promise((resolve, reject) => {
      this.db.collection('projects').doc(id).update({
        deleted : new Date(),
      }).then((res: any) => resolve(res), err => reject(err));
    })
  }

    // saveproject()
    // {

    // }

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

    updateProject(project: project ) {
      return new Promise ((resolve, reject) => {
        this.db.collection('projects').doc(project.id).update({
          name: project.name,
          description: project.description,
          ubication: project.ubication,
          start: project.start,
          end: project.end,
          administrators: project.administrators,
        }).then((res:any) => resolve(res), err => reject(err));
      })
    }

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
