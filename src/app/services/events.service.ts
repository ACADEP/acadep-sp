import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Event } from '../models/event';
import { Action } from 'rxjs/internal/scheduler/Action';

declare var $ : any;

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
        status : 1,
        observation : {
          before : {
            active : true,
            evidence : []
          },
          during : {
            active : true,
            evidence : []
          },
          after : {
            active : true,
            evidence : []
          },
        }

      }).then((res: any) =>
      {
        this.db.collection('events').doc(res.id).update({
          id: res.id
        }).then(async res =>{

          //notificacion push

           
          $.ajax({
            data : {
              "app_id": "d7d8b147-ad7c-48f6-be54-a1b9c423d4c5",
              "included_segments": ["All"],
              "template_id":"0d112e3e-acb1-4e78-9ad3-7fa19b9f1c86"
              // "contents": {"es": "tienes trabajo por hacer!", "en": "tienes trabajo por hacer!"}
            },
            url : 'https://onesignal.com/api/v1/notifications',
            type : 'post',
            beforeSend: function (xhr) {
              xhr.setRequestHeader ("Authorization", "Basic NTc5YzY4MWItMmU2ZC00MzhjLWI2MzQtM2RlMmUxMTM3ZTYz");
          },
            success : function (res){
              console.log(res);
            }
          })

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
        staff: event.staff,
        status : 1
      }).then((res:any) => resolve(res), err => reject(err));
    })
  }

}


