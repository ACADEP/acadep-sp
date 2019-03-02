import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { project } from "../models/project";


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
        description: project.description,
        ubication: project.ubication,
        start: project.start,
        end: project.end,
        administrators: project.administrators,
        deleted: '',
        childrens: project.childrens,
        type: project.type

      }).then((res: any) => {
        resolve(res)
      })
        .catch(err => {
          reject(err)
        });
    })
  }

  /**
   * 
   * @param id 
   * 
   */
  deleteProject(id: string) {
    return new Promise((resolve, reject) => {
      this.db.collection('projects').doc(id).update({
        deleted: new Date(),
      }).then((res: any) => {
        resolve(res)
      })
        .catch(err => {
          reject(err)
        });
    })
  }



/**
 * 
 * @param name 
 * @param subprojects 
 */
  importProject(name: string, subprojects: string[]) {
    return new Promise((resolve, reject) => {
      this.db.collection('projects').add({
        title: name,
        description: '',
        ubication: {
          lat: 0,
          lng: 0
        },
        start: new Date().toJSON(),
        end: new Date().toJSON(),
        administrators: [],
        deleted: '',
        type: 'project',
        childrens: true
      }).then((res: any) => {
        resolve(res)
      })
        .catch(err => {
          reject(err)
        });
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
        childrens: project.childrens,
        type: project.type
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
