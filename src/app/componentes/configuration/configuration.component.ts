import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { NotifierService } from 'angular-notifier';
import { NgForm } from '@angular/forms';

interface configuration {
  min_photos : number,
  max_photos : number
}

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.css']
})
export class ConfigurationComponent implements OnInit {

  public configuration= {} as configuration;

  private readonly notifier: NotifierService;

  constructor(public db: AngularFirestore, notifierService: NotifierService) {
    this.notifier = notifierService;
   }

  ngOnInit() {
   
   this.db.collection('configuration').doc('global').ref.get().then( doc =>{

    this.configuration = doc.data() as configuration;
      console.log(this.configuration)
    }).catch(err => {
      console.log('error inesperado: ' + err)
    })
 
  }


  saveChanges(form : NgForm){

    console.log(form)
    
    if(form.valid && this.configuration.min_photos < this.configuration.max_photos){

      this.db.collection('configuration').doc('global').update({
        min_photos : this.configuration.min_photos,
        max_photos : this.configuration.max_photos
      }).then(res => {
        this.notifier.notify('success', 'Cambios guardados!');
      }).catch(err => {
        console.log(err)
      })

    }else{
      this.notifier.notify('error', 'Por favor corrija los errores');


    }


    // if(this.configuration.max_photos != null  )
    // {

    //   if(this.num_photos > 1 && this.num_photos < 1001)
    //   {
       
    //   }else{
    //   this.notifier.notify('error', 'Ingrese un número entre 1 y 1000');
    //   }
      
    // }else{
    //   this.notifier.notify('error', 'el campo no se puede enviar vacío');

    // }

    
  }

}
