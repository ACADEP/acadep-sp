import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { NotifierService } from 'angular-notifier';


@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.css']
})
export class ConfigurationComponent implements OnInit {

  public num_photos:number;

  private readonly notifier: NotifierService;

  constructor(public db: AngularFirestore, notifierService: NotifierService) {
    this.notifier = notifierService;
   }

  ngOnInit() {
   
   this.db.collection('configuration').doc('global').ref.get().then( doc =>{

    this.num_photos = doc.data().num_photos;
      // console.log(res.data())
    }).catch(err => {
      console.log('error inesperado: ' + err)
    })
 
  }


  saveChanges(){



    if(this.num_photos != null )
    {

      if(this.num_photos > 1 && this.num_photos < 1001)
      {
        this.db.collection('configuration').doc('global').update({
          num_photos : this.num_photos
        }).then(res => {
          this.notifier.notify('success', 'Cambios guardados!');
        }).catch(err => {
          console.log(err)
        })
      }else{
      this.notifier.notify('error', 'Ingrese un número entre 1 y 1000');
      }
      
    }else{
      this.notifier.notify('error', 'el campo no se puede enviar vacío');

    }

    
  }

}
