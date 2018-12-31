import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Event } from '../models/event';
import { Action } from 'rxjs/internal/scheduler/Action';


@Injectable({
  providedIn: 'root'
})
export class EventsService {
  eventsCollection: AngularFirestoreCollection<Event>;
  events: Observable<Event[]>;
  eventDoc: Event;

  constructor(public db: AngularFirestore) { }

  getEvents() {
    this.eventsCollection = this.db.collection('events', ref => ref.where('deleted', '==', false));
    this.events = this.eventsCollection.snapshotChanges().pipe(map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as Event;
        data.id = a.payload.doc.id;
        return data;
      });
    }));
    return this.events;
  }

  addEvent(event: Event) {
    return new Promise((resolve, reject) => {
      this.db.collection('events').add({
        active: true,
        activity_id: event.activity_id,
        user_id: event.user_id,
        type_activity : event.type,
        name: event.name,
        description: event.description,

        start: event.start,
        end: event.end,
        tools: event.tools,
        staff: event.staff,
        deleted: false,

        // observations : {
        //   before :{
        //     photos:{},
        //     texts: {},
        //     active:true
        //   },
        //   during :{
        //     photos:{},
        //     texts: {},
        //     active:true
        //   },
        //   after :{
        //     photos:{},
        //     texts: {},
        //     active:true
        //   }
        // }
      }).then((res: any) =>
      {
        this.db.collection('events').doc(res.id).update({
          id: res.id
        })
        resolve(res)
      } , err => reject(err));


    })

  }

  deleteEvent(key: string) {

  }

  updateEvent(event: Event) {
    return new Promise ((resolve, reject) => {
      this.db.collection('events').doc(event.id).update({
        active: true,
        activity_id: event.activity_id,
        user_id: event.user_id,
        name: event.name,
        description: event.description,
        start: event.start,
        end: event.end,
        tools: event.tools,
        staff: event.staff
      }).then((res:any) => resolve(res), err => reject(err));
    })
  }

}


