import { Injectable } from '@angular/core';
import { AngularFirestore } from "@angular/fire/firestore";
import { Config } from '../models/config';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  constructor(public db: AngularFirestore) { }

  saveConfig(config : Config) {

    return new Promise((resolve, rejected) => {
      this.db.collection('configuration').doc('global').update({

        event_types : config.event_types,
       

      }).then(res => {
        resolve('done')
      }).catch((err) => {
        rejected(err)
      })
    })
  }
}
