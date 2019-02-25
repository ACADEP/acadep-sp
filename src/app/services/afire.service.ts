import { Injectable } from '@angular/core';
import {AngularFirestore, DocumentChangeAction} from '@angular/fire/firestore';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AfireService {

  constructor(private afs: AngularFirestore) { }

  paginate (limit: number, last: string):  Observable<DocumentChangeAction<any>[]> {
    return this.afs.collection('events', (ref) => (
     ref
     .where('start', '>', last)
     .orderBy('start', 'asc')
       .limit(limit)
    )).snapshotChanges();
 }
}
