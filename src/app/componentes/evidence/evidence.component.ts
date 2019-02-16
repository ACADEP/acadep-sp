import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Gallery, GalleryItem, ImageItem, ThumbnailsPosition, ImageSize } from '@ngx-gallery/core';
import { map } from 'rxjs/operators';
import { EvidenceService } from "../../services/evidence.service";
import { EventsService } from "../../services/events.service";
import { UsersService } from "../../services/users.service";
import { MatAccordion } from '@angular/material';
import { Content } from '@angular/compiler/src/render3/r3_ast';

import * as jsPDF from 'jspdf'
import { element } from '@angular/core/src/render3';
import { configPdf } from '../configuration/configuration.component';
import { AngularFirestore } from '@angular/fire/firestore';
declare var $: any;
interface ubication {
  lat: number,
  lng: number
}

interface image {
  src: string,
  created_at: string,
  type: string,
  ubication: ubication

}

@Component({
  selector: 'app-evidence',
  templateUrl: './evidence.component.html',
  styleUrls: ['./evidence.component.css'],
  // changeDetection: ChangeDetectionStrategy.OnPush

})
export class EvidenceComponent implements OnInit {

  // @ViewChild('content') content: ElementRef;
  // header_1 = 'https://firebasestorage.googleapis.com/v0/b/seguimiento-de-proyectos-4fa3c.appspot.com/o/pdf_configuration%2F1sf2wdkxh5m?alt=media&token=03f95f47-0c8b-4bd7-967d-4c9b970b9d2b'
  // header_2 = 'https://firebasestorage.googleapis.com/v0/b/seguimiento-de-proyectos-4fa3c.appspot.com/o/pdf_configuration%2F1sf2wdkxh5m?alt=media&token=03f95f47-0c8b-4bd7-967d-4c9b970b9d2b'

  // text_header = 'header lorem ipsum dolor at sit';
  // text_footer = 'footer lorem ipsum dolor at sit';


  idEvent = "";
  idUser = "";


  @ViewChild('content') content: ElementRef;
  public image = {} as image;
  items: GalleryItem[];
  evidenceCollection: any[];
  eventsCollection: any[];
  usersCollection: any[];

  @ViewChild('myaccordion') myPanels: MatAccordion;
  configPdf = {} as configPdf;

  constructor(public gallery: Gallery, public evidenceService: EvidenceService,
    public eventsService: EventsService, public usersService: UsersService,
    public db: AngularFirestore) {
    this.image.ubication = {
      lat: 0,
      lng: 0
    }
  }



  ngOnInit() {

    this.db.collection('configuration').doc('pdf').ref.get().then(doc => {
      this.configPdf = doc.data() as configPdf;
    }).catch(err => {
      console.log('error inesperado: ' + err)
    })

    this.evidenceService.getEvidence().subscribe(evidence => {
      this.evidenceCollection = evidence;
    })

    this.eventsService.getEvents().subscribe(events => {
      this.eventsCollection = events
    })

    this.usersService.getUsers().subscribe(users => {
      this.usersCollection = users
    })


  }

  // getUnit(id){
  //   this.eventsService.getEventById(id).then( (res : any) => {
  //     return res.total.unit
  //   })
  // }



  UpdateEvidence() {

    if (this.idEvent != "" || this.idUser != "") {
      this.evidenceService.searchEvidence(this.idEvent, this.idUser).subscribe(newEvidence => {
        this.evidenceCollection = newEvidence
      })
    } else {
      this.evidenceService.getEvidence().subscribe(evidence => {
        this.evidenceCollection = evidence;
      })
    }
  }

  async export(evidence, e) {

    let doc = new jsPDF();
    let content = '<p>'+evidence.description+'</p>';
    console.log(e)
    let specialElementhandlers = {
      '#editor': function (element, renderer) {
        return true
      }
    };

    
    // doc.setFont('courier')
    doc.setFontType('bold')
    doc.text(70, 20, this.configPdf.text_header)
    doc.text(55, 280, this.configPdf.text_footer)

    doc.setFontType('normal')
    doc.setFontSize(14)
    doc.text(10, 40, ('Fecha : '+new Date().toDateString()));
    doc.text(10, 50, ('Descripción : '));
    doc.fromHTML(content, 10, 50, {
      width: 190,
      'elementHandlers': specialElementhandlers
    });


   /*
    *
    * header 1

    */

    var img = new Image();
    img.setAttribute('crossOrigin', 'anonymous');
    img.src = this.configPdf.img_header1;
    img.onload = function () {
      var canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      var ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      var dataURL = canvas.toDataURL("image/png");
      let image = dataURL.replace(/^data:image\/(png|jpg);base64,/, "");

      doc.addImage(image, "JPG", 10, 10, 50, 10);

    }

 /*
  *
  *
  * header 2

  */

    var img2 = new Image();
    img2.setAttribute('crossOrigin', 'anonymous');
    img2.src = this.configPdf.img_header2;
    img2.onload = function () {
      var canvas = document.createElement("canvas");
      canvas.width = img2.width;
      canvas.height = img2.height;
      var ctx = canvas.getContext("2d");
      ctx.drawImage(img2, 0, 0);
      var dataURL = canvas.toDataURL("image/png");
      let image2 = dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
      doc.addImage(image2, "JPG", 140, 10, 50, 10);

    }


    var cont = 1;
    var tam = evidence.multimedia.length;

    evidence.multimedia.forEach(imagen => {
      var image;
      var img = new Image();
      img.setAttribute('crossOrigin', 'anonymous');
      img.src = imagen.src;
      img.onload = function () {

        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;

        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        var dataURL = canvas.toDataURL("image/png");
        if (cont > 3) {
          doc.addPage();
          cont = 1
          console.log('se añadio pagina')
        }
        image = dataURL.replace(/^data:image\/(png|jpg);base64,/, "");

        doc.addImage(image, "JPG", 50, (cont * 70), 100, 50);
        cont = cont + 1;
      };
    });

    setTimeout(() => {
      doc.save('Test.pdf');
    }, tam * 1500 + 2000);
    //   setTimeout(() => {
    //   doc.save('Test.pdf');
    // }, 3000);

  }


  async getBase64FromImageUrl(URL) {

    new Promise(function (resolve) {
      var image;
      var img = new Image();
      img.setAttribute('crossOrigin', 'anonymous');
      img.src = URL;
      img.onload = function () {
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        var dataURL = canvas.toDataURL("image/png");
        image = dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
        resolve(image);
      };
    });
  }

  pdf() {
    let doc = new jsPDF();
    let specialElementhandlers = {
      '#editor': function (element, renderer) {
        return true
      }
    };
    let image = 'base64'

    let content = this.content.nativeElement;
    doc.fromHTML(content.innerHTML, 15, 15, {
      width: 190,
      'elementHandlers': specialElementhandlers
    });
    doc.addImage(image, 'JPEG', 15, 40, 180, 160)
    doc.save('test.pdf');
  }

  openAll() {
    this.myPanels.openAll();
  }

  closeAll() {
    this.myPanels.closeAll();
  }

  showImage(evidence, index) {

    this.image = evidence.multimedia[index];

    $('#showimage').modal('show');
    console.log(index);
    // console.log(this.image.src);

  }

  getColor(type) {
    type = type.toLowerCase();

    switch (type) {
      case 'pdf':
        return '#f43636'

      case 'word':
        return '#3672f4'

      default:
        return 'inherit'
    }
  }

  getClass(type) {
    type = type.toLowerCase();
    switch (type) {
      case 'pdf':
        return 'fa fa-file-pdf fa-2x'
      case 'word':
        return 'fa fa-file-word fa-2x'
      case 'video':
        return 'fa fa-file-video fa-2x'
      default:
        return 'fa fa-file fa-2x'
    }
  }

  convertFile(imagepath) {

    this.toDataUrl(imagepath, function (myBase64) {
      console.log(myBase64); // myBase64 is the base64 string
    });

  }



  toDataUrl(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
      var reader = new FileReader();
      reader.onloadend = function () {
        callback(reader.result);
      }
      reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
  }


}
