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
declare var $: any;
interface ubication {
  lat: number,
  lng: number
}

interface image {
  src: string;
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


  idEvent = "";
  idUser = "";


  @ViewChild('content') content: ElementRef;
  public image = {} as image;
  items: GalleryItem[];
  evidenceCollection: any[];
  eventsCollection: any[];
  usersCollection: any[];

  @ViewChild('myaccordion') myPanels: MatAccordion;

  constructor(public gallery: Gallery, public evidenceService: EvidenceService,
    public eventsService: EventsService, public usersService: UsersService) {
    this.image.ubication = {
      lat: 0,
      lng: 0
    }
  }

  ngOnInit() {

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

  async export(evidence) {

// var images = [];
    // console.log(evidence)
    var cont = 1;
    // var arraylenght = evidence.multimedia.length;
    let doc = new jsPDF();
  var tam = evidence.multimedia.length;


// console.log(evidence.multimedia[0].src)

        doc.setFont('courier')
         doc.setFontType('normal')
         doc.text(20, 30, evidence.description)
        //  doc.addImage(image, "JPG", 10, (50), 100, 80);


// img.width = 300;
// img.height = 300;

evidence.multimedia.forEach(imagen => {
  var image;
  var img = new Image();
  img.setAttribute('crossOrigin', 'anonymous');
  img.src =  imagen.src;
  img.onload = function () {

    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;

    console.log(img.width, img.height)

    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    var dataURL = canvas.toDataURL("image/png");
   
    if(cont > 3){
      doc.addPage();
      cont=1
      console.log('se añadio pagina')
       
     }
     image = dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
       
     
     doc.addImage(image, "JPG", 50, (cont*60), 100, 50);
     cont = cont + 1;
    
   
    };

    });
    
  
  

    setTimeout(() => {
      doc.save('Test.pdf');
      
    }, tam * 1500);

  
  }


async getBase64FromImageUrl(URL) {

  new Promise(function(resolve, reject) { 

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
       console.log(image)
    };


   });



   
  
  }

  // getBase64Image(img) {
  //   var canvas = document.createElement("canvas");
  //   console.log(img);
  //   canvas.width = img.width;
  //   canvas.height = img.height;
  //   var ctx = canvas.getContext("2d");
  //   ctx.drawImage(img, 0, 0);
  //   var dataURL = canvas.toDataURL("image/png");
  //   return dataURL;
  // }

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
    // this.src = event.target.src;
    $('#showimage').modal('show');
    console.log(this.image)
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
