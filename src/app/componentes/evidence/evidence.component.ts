import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Gallery, GalleryItem, ImageItem, ThumbnailsPosition, ImageSize } from '@ngx-gallery/core';
import { map } from 'rxjs/operators';
import { EvidenceService } from "../../services/evidence.service";
import { EventsService } from "../../services/events.service";
import { UsersService } from "../../services/users.service";
import { MatAccordion } from '@angular/material';
import { Content } from '@angular/compiler/src/render3/r3_ast';

import * as jsPDF from 'jspdf'
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
    console.log(evidence)

    let doc = new jsPDF();

    doc.setFont('courier')
    doc.setFontType('normal')
    doc.text(20, 30, evidence.description)

    const imgData = await this.getBase64Image(document.getElementById('imagentest'));

    doc.addImage(imgData, 'JPEG', 15, 40, 180, 160);

    doc.save('test.pdf');

  }


  getBase64Image(img) {
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    var dataURL = canvas.toDataURL("image/png");
    return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
  }

  pdf() {

    let doc = new jsPDF();
    let specialElementhandlers = {
      '#editor': function (element, renderer) {
        return true
      }
    };
    let image = 'data:image/gif;base64,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';

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
