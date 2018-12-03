import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class ActivitiesService {

  activitiesList: AngularFireList<any>;

  constructor(public firebase : AngularFireDatabase) { }

  getActivities()
  {
    this.activitiesList = this.firebase.list('Activities');
    return this.activitiesList;
    // return this.firebase.database.ref().child('projects');
   
  }

  getActivity($key){
    return new Promise((resolve, reject) => {
      this.firebase.database.ref('Activities/' + $key).once('value')
      .then(res => resolve(res.val()),
        err => reject(err));
    });
    }

  addActivity(name:string, project_id: any, description:Text, type: string, start: Date, end: Date, tools:any){
    
    return new Promise ((resolve, reject) =>{
      this.activitiesList.push({
     
      }).then((obj : any) => {
        this.firebase.database.ref('Activities/' + obj.key).set({
          id: obj.key,
        name: name,
        type: type,
        project_id: project_id,
        description: description,
        start: start,
        end: end,
        active : true,
        tools : tools
        })
      }).then((res: any) => resolve(res), err => reject(err));
    })
    
    // console.log(name, description, type, start, end, tools);
  }

  deleteActivity(key:string)
  {

    return new Promise((resolve, reject) => {
      this.activitiesList.update(key, {active : false})
        .then(res => resolve(key),
          err => reject(err));
    });

  }

}
