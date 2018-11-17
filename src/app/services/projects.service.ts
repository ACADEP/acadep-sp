import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';


@Injectable({
  providedIn: 'root'
})
export class ProjectsService {

  userList: AngularFireList<any>;
  // public algo: any;

projectList : AngularFireList<any>;
  constructor(    
    private firebase: AngularFireDatabase
    ) { }

    getProjects()
    {
      this.projectList = this.firebase.list('projects');
      return this.projectList;
      // return this.firebase.database.ref().child('projects');
     
    }

    getUsers()
    {
      this.userList = this.firebase.list('users');
      return this.userList;
      // return this.firebase.database.ref().child('projects');
     
    }

    addProject(name:string, description:string){
      this.projectList.push({
        name: name,
        description: description
      })
    }

    updateproject($key:string){

    }

    removeproject($key){
      this.projectList.remove($key)
    }
}
