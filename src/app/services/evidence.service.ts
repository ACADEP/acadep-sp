import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class EvidenceService {

  holi = [
    'hola',
    'hola',
    'hola',
    'hola',
    'hola',
    'hola',
    'hola',
  ]
  evidenceCollection: AngularFirestoreCollection<any>;
  evidence: Observable<any[]>;
  evidenceDoc: any;
  constructor(public db: AngularFirestore) { }

  getEvents() {
    this.evidenceCollection = this.db.collection('evidence', ref => ref.where('test', '==', true));
    this.evidence = this.evidenceCollection.snapshotChanges().pipe(map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data();
        data.id = a.payload.doc.id;
        return data;
      });
    }));
    console.log(this.evidence)
    return this.evidence;
  }

}
