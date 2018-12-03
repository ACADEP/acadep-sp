import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';


@Injectable({
  providedIn: 'root'
})
export class EventsService {
  eventsList: AngularFireList<any>;

  constructor(public firebase : AngularFireDatabase) { }

  getEvents()
  {
    this.eventsList = this.firebase.list('Eventos');
    return this.eventsList;
    // return this.firebase.database.ref().child('projects');
   
  }

  addEvent(name:string, uid: string, start: string, end: string, activity:string){
    this.eventsList.push({
     
    }).then((res : any) => {
      this.firebase.database.ref('Eventos/' + res.key).set({
        idevent: res.key,
      name: name,
      actividad: 'Supervision',
      uid: uid,
      start: start,
      end: end,
      activity_id : activity, 
      active : true
      })

     console.log(res);
    })
  }

  deleteEvent(key:string)
  {

    return new Promise((resolve, reject) => {
      this.eventsList.update(key, {active : false})
        .then(res => resolve(key),
          err => reject(err));
    });

  }

}


