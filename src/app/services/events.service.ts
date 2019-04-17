import { Injectable } from '@angular/core';
// import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { AngularFirestoreCollection, AngularFirestoreDocument, AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Event } from '../models/event';
// import { Action } from 'rxjs/internal/scheduler/Action';

import * as moment from 'moment';
import { isNullOrUndefined } from 'util';

declare var $: any;

@Injectable({
  providedIn: 'root'
})
export class EventsService {
  eventsCollection: AngularFirestoreCollection<Event>;
  events: Observable<Event[]>;
  eventDocument : AngularFirestoreDocument; 
  eventDoc: Event;

  public nameEvent: string;
  constructor(public db: AngularFirestore) { }

  getEvents() {
    this.eventsCollection = this.db.collection('events', ref => ref.where('deleted', '==', '').orderBy("start", "desc"));
    this.events = this.eventsCollection.snapshotChanges().pipe(map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as Event;
        data.id = a.payload.doc.id;
        return data;
      });
    }));
    return this.events;
  }

  getEventsByActivity(activity_id) {
    this.eventsCollection = this.db.collection('events', ref => ref
      .where('deleted', '==', '')
      .where('activity_id', '==', activity_id)
      .orderBy('title'));
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
    this.nameEvent = event.title;
    return new Promise((resolve, reject) => {
      this.db.collection('events').add({
        active: true,
        activity_id: event.activity_id,
        user_id: event.user_id,
        type_activity: event.type,
        title: event.title,
        description: event.description,
        start: event.start,
        end: event.end,
        tools: event.tools,
        staff: event.staff,
        deleted: '',
        color: '#333',
        created_at: new Date().toJSON(),
        updated_at: new Date().toJSON(),
        before_complete: false,
        during_complete: false,
        advanced: 0,
        total: event.total
      }).then((res: any) => {


        console.log(res)

        // this.db.collection('users').doc(event.user_id).ref.get().then((user: any) => {

        //   var settings = {
        //     "async": true,
        //     "crossDomain": true,
        //     "url": "https://fcm.googleapis.com/fcm/send",
        //     "method": "POST",
        //     "headers": {
        //       "Content-Type": "application/json",
        //       "Authorization": "key=AAAAj8zqaUE:APA91bERYCowiiiRXxOgRLH3hTGjbz-0AJrfaUtGEWUflAD5HrtwHmvo4qRV18G-hLBmoNtDOyRBzBv8ouEJvredPC4JXmjgSh4d-l9lEQ9XS-UabYW2wZna92YAWKNhZShZAopFwF8M"
        //     },
        //     "processData": false,
        //     "data": "{\n   \"notification\": {\n     \"title\": \"Se te ha asignado un nuevo evento\",\n        \"body\": \"" + event.title + "\",\n        \"sound\": \"default\",\n        \"click_action\": \"Login.class\",\n        \"icon\": \"fcm_push_icon\"\n    },\n    \"to\": " + '"' + user.data().token + '"' + ",\n    \"priority\": \"high\",\n    \"restricted_package_name\": \"\"\n}"
        //   }

        //   $.ajax(settings).done(function (response) {
        //     console.log(response);
        //   }).catch('token undefined');


        // }).catch(err => {
        //   console.log('user undefined')
        // })


        this.db.collection('events').doc(res.id).update({
          id: res.id
        }).then(() => {
          // notificacion push
        })
        resolve(res)
      }, err => reject(err));
    })
  }

  deleteEvent(key: string) {

    return new Promise((resolve, reject) => {

      this.db.collection('events').doc(key).update({
        deleted: new Date().toJSON().substr(0, 16)
      }).then((res: any) => resolve(res)).catch(err => reject(err))
    })

  }

  updateEvent(event: Event) {
    return new Promise((resolve, reject) => {
      this.db.collection('events').doc(event.id).update({
        active: true,
        activity_id: event.activity_id,
        user_id: event.user_id,
        title: event.title,
        description: event.description,
        start: event.start,
        end: event.end,
        tools: event.tools,
        staff: event.staff,
        // color: event.status
      }).then((res: any) => {

        console.log(res)

        // this.db.collection('users').doc(event.user_id).ref.get().then((user: any) => {



        //     var settings = {
        //       "async": true,
        //       "crossDomain": true,
        //       "url": "https://fcm.googleapis.com/fcm/send",
        //       "method": "POST",
        //       "headers": {
        //         "Content-Type": "application/json",
        //         "Authorization": "key=AAAAj8zqaUE:APA91bERYCowiiiRXxOgRLH3hTGjbz-0AJrfaUtGEWUflAD5HrtwHmvo4qRV18G-hLBmoNtDOyRBzBv8ouEJvredPC4JXmjgSh4d-l9lEQ9XS-UabYW2wZna92YAWKNhZShZAopFwF8M"
        //       },
        //       "processData": false,
        //       "data": "{\n   \"notification\": {\n     \"title\": \"Se te ha asignado un nuevo evento\",\n        \"body\": \"" + event.title + "\",\n        \"sound\": \"default\",\n        \"click_action\": \"Login.class\",\n        \"icon\": \"fcm_push_icon\"\n    },\n    \"to\": " + '"' + user.data().token + '"' + ",\n    \"priority\": \"high\",\n    \"restricted_package_name\": \"\"\n}"
        //     }

        //     $.ajax(settings).done(function (response) {
        //       console.log(response);
        //     }).catch('token undefined');



        // }).catch(err => {
        //   console.log('user undefined')
        // })

        resolve(res)

      }, err => reject(err));
    })
  }


  getEventById(id) {

    return new Promise((resolve, reject) => {
      this.db.collection('events').doc(id).ref.get()
        .then(res => resolve(res.data()),
          err => reject(err));
    });
  }

  getEventObservableId(id:string){
    this.eventDocument = this.db.collection('events').doc(id);
    return this.eventDocument.snapshotChanges();
  }

  ImportEvent(event) {

    // let start = moment().format('Y-MM-DDThh:mm');
    // let end = moment().add(1, 'minute').format('Y-MM-DDThh:mm');
    let start = event.fecha_inicio.substring(0, 16);
    let end = event.fecha_final.substring(0, 16);
    return new Promise((resolve, reject) => {
      this.db.collection('events').add({
        active: true,
        during_complete: false,
        before_complete: false,
        activity_id: event.activity_id,
        // activity_name : event.activity_name,
        user_id: 'undefined',
        type_activity: 'supervision',
        title: event.name,
        description: event.description,
        start: start,
        user_mail: 'undefined',
        // user_mail: event.user_mail,
        end: end,
        tools: [],
        staff: [],
        deleted: '',
        color: '#89609e',
        advanced: 0,
        created_at: new Date().toJSON(),
        updated_at: new Date().toJSON(),
        // subproject_name: event.sub_name,
        total: {
          unit: event.unit,
          number: event.number
        }
      }).then((res: any) => {
        this.db.collection('events').doc(res.id).update({
          id: res.id
        }).then(updated => {

          resolve(res)
        })
      }, err => reject(err));
    })
  }

  getEventsUndefined2() {
    this.eventsCollection = this.db.collection('events', ref => ref
      .where('deleted', '==', '')
      .where('user_id', '==', 'undefined')
      .limit(10));

    this.events = this.eventsCollection.snapshotChanges().pipe(map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as Event;
        data.id = a.payload.doc.id;
        return data;
      });
    }));
    return this.events;
  }

  getEventsUndefined() {
    this.eventsCollection = this.db.collection('events', ref => ref
      .where('deleted', '==', '')
      .where('user_id', '==', 'undefined'));

    this.events = this.eventsCollection.snapshotChanges().pipe(map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as Event;
        data.id = a.payload.doc.id;
        return data;
      });
    }));
    return this.events;
  }

}


