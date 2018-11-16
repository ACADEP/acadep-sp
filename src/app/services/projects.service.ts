import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';


@Injectable({
  providedIn: 'root'
})
export class ProjectsService {

  userList: AngularFireList<any>;
  // public algo: any;


  constructor(    
    private firebase: AngularFireDatabase
    ) { }

    getProjects()
    {
      return this.firebase.database.ref().child('projects');
     
    }
}
