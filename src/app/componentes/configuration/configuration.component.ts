import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { NotifierService } from 'angular-notifier';
import { NgForm } from '@angular/forms';
import { AngularFireStorage } from "@angular/fire/storage";
import { finalize } from "rxjs/operators";
import { Observable } from 'rxjs';

interface configuration {
  min_photos: number,
  max_photos: number,
}
export interface configPdf {
  img_header1: any,
  img_header2: string,
  text_header: string,
  text_footer: string
}

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.css']
})
export class ConfigurationComponent implements OnInit {

  public activities:any;

  nameAct : string;

  public configGlobal = {} as configuration;

  public configPdf = {} as configPdf;

  loading: boolean = false;
  loading2: boolean = false;

  uploadPercent: Observable<number>;
  urlimage: Observable<string>;

  private readonly notifier: NotifierService;

  constructor(public db: AngularFirestore,
    notifierService: NotifierService,
    public storage: AngularFireStorage) {
    this.notifier = notifierService;
  }

  ngOnInit() {

    this.db.collection('configuration').doc('global').ref.get().then(doc => {
      this.configGlobal = doc.data() as configuration;
     this.activities = doc.data().activitys_types;
    }).catch(err => {
      console.log('error inesperado: ' + err)
    })
    
    this.db.collection('configuration').doc('pdf').ref.get().then(doc => {
      this.configPdf = doc.data() as configPdf;
      console.log(this.configPdf)
    }).catch(err => {
      console.log('error inesperado: ' + err)
    })

  }

  addType(){

    this.activities.push(this.nameAct).then(res=>{

      this.db.collection('configuration').doc('global').update({
        activitys_types : this.activities
      })
    })
    

    
  }


  saveChanges(form: NgForm) {

    console.log(form)

    if (form.valid && this.configGlobal.min_photos < this.configGlobal.max_photos) {

      this.db.collection('configuration').doc('global').update({
        min_photos: this.configGlobal.min_photos,
        max_photos: this.configGlobal.max_photos
      }).then(res => {
      
        this.db.collection('configuration').doc('pdf').update({
         img_header1 : this.configPdf.img_header1,
         img_header2 : this.configPdf.img_header2,
         text_header : this.configPdf.text_header,
         text_footer : this.configPdf.text_footer
        }).then(res => {
          this.notifier.notify('success', 'Cambios guardados!');
        }).catch(err => {
          console.log(err)
        })

      }).catch(err => {
        console.log(err)
      })

    } else {
      this.notifier.notify('error', 'Por favor corrija los errores');

    }

  }

  uploadImage($event, photo) {
    if(photo == 1){
      this.loading = true;
    }else{
      this.loading2 = true;
    }

    const id = Math.random().toString(36).substring(2);
    const file = $event.target.files[0];
    const filepath = `pdf_configuration/${id}`;

    const ref = this.storage.ref(filepath);

    const task = this.storage.upload(filepath, file).then(res => {
      // console.log(res.downloadURL)
      res.ref.getDownloadURL().then( url => {

        if(photo == 1){
        this.loading = false;

          this.configPdf.img_header1 = url
        }else if(photo == 2){
          this.loading2 = false;

          this.configPdf.img_header2 = url

        }
      })
    })

    // this.uploadPercent = ;
    // task.snapshotChanges().pipe(finalize(() => this.configPdf.img_header1 = ref.getDownloadURL())).subscribe();

  }

}
