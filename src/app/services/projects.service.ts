import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { project } from "../models/project";
import { resolve, isRejected } from 'q';


@Injectable({
  providedIn: 'root'
})
export class ProjectsService {
  projectsCollection: AngularFirestoreCollection<project>;
  projects: Observable<project[]>;
  projectDoc;

  constructor(
    private db: AngularFirestore
  ) { }



  getProjects() {
    this.projectsCollection = this.db.collection('projects', ref => ref.where('deleted', '==', '').orderBy('title', 'asc'));
    this.projects = this.projectsCollection.snapshotChanges().pipe(map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as project;
        // data.id = a.payload.doc.id;
        return data;
      });
    }));
    return this.projects;
  }


  getProjectsFilter(text: string) {
    this.projectsCollection = this.db.collection('projects', ref => ref.where('deleted', '==', '').orderBy('title', 'asc').startAt(text).endAt(text + "\uf8ff"));
    this.projects = this.projectsCollection.snapshotChanges().pipe(map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as project;
        // data.id = a.payload.doc.id;
        return data;
      });
    }));
    return this.projects;
  }

  getProject(id) {

    return new Promise((resolve, reject) => {
      this.db.collection('projects').doc(id).ref.get()
        .then((res: any) => resolve(res.data()), err => reject(err));
    });

  }


  /**
   * 
   * @param name 
   */
  searchProjects(name: string) {
    this.projectsCollection = this.db.collection('projects', ref => ref.where('deleted', '==', ''));
    this.projects = this.projectsCollection.snapshotChanges().pipe(map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as project;
        data.id = a.payload.doc.id;
        return data;
      });
    }));

    return this.projects;
  }

  /**
   * 
   * @param project 
   * 
   */
  saveProject(project: project) {

    return new Promise((resolve, reject) => {
      this.db.collection('projects').add({

        title: project.title,
        active: true,
        advanced: 0,
        description: project.description,
        ubication: project.ubication,
        start: project.start,
        end: project.end,
        administrators: project.administrators,
        deleted: '',
        created_at: new Date().toJSON(),
        updated_at: new Date().toJSON()

      }).then((res: any) => {

        this.db.collection('projects').doc(res.id).update({
          id: res.id
        }).then(updated => {

          resolve(res)
        })
      }, err => reject(err));
    })
  }

  /**
   * 
   * @param id 
   * 
   */
  deleteProject(id: string) {

    return new Promise((resolve, rejected)=>{

      this.db.doc(`projects/${id}`).delete().then(()=>{
        resolve()
      }).catch(()=>{
        rejected()
      })
    })


    // return new Promise((resolve, reject) => {
    //   this.db.collection('projects').doc(id).update({
    //     deleted: new Date().toJSON(),
    //     active : false
    //   }).then((res: any) => {
    //     this.db.collection('activities').ref.where('project_id', '==', id).get().then(acts => {
    //       acts.docs.map(activity => {
    //         this.db.doc(`activities/${activity.data().id}`).update({
    //           deleted: new Date().toJSON(),
    //           active: false
    //         }).then(() => {
    //           this.db.collection('events').ref.where('activity_id', '==', activity.data().id).get().then(events => {
    //             events.docs.map(event => {
    //               this.db.doc(`events/${event.data().id}`).update({
    //                 deleted: new Date().toJSON(),
    //                 active: false
    //               })
    //             })
    //           })
    //         })
    //       })
    //     })
    //     resolve(res)
    //   })
    //     .catch(err => {
    //       reject(err)
    //     });
    // })

  }



  /**
   * 
   * @param name 
   * @param subprojects 
   */
  importProject(project) {
    return new Promise((resolve, reject) => {
      this.db.collection('projects').add({
        title: project.name,
        description: '',
        ubication: {
          lat: 0,
          lng: 0
        },
        start: project.fecha_inicio.substring(0, 16),
        end: project.fecha_final.substring(0, 16),
        administrators: [],
        deleted: '',
        advanced: 0,
        active: true,
        childrens: true,
        created_at: new Date().toJSON(),
        updated_at: new Date().toJSON(),
      }).then((res: any) => {

        this.db.collection('projects').doc(res.id).update({
          id: res.id
        }).then(updated => {

          resolve(res)
        })
      }, err => reject(err));

    })

  }

  /**
   * 
   * @param project 
   */
  updateProject(project: project) {
    console.log(project)
    return new Promise((resolve, reject) => {
      this.db.collection('projects').doc(project.id).update({
        title: project.title,
        description: project.description,
        ubication: project.ubication,
        start: project.start,
        end: project.end,
        administrators: project.administrators,
        updated_at: new Date().toJSON(),
      })
        .then((res: any) => {
          resolve(res)
        })
        .catch(err => {
          reject(err)
        });
    })
  }



}
