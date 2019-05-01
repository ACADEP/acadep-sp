import { Component, OnInit, ViewChild, ElementRef, ViewChildren } from '@angular/core';
// import { Gallery, GalleryItem, ImageItem, ThumbnailsPosition, ImageSize } from '@ngx-gallery/core';
import { ActivitiesService } from '../../services/activities.service';
import { EvidenceService } from "../../services/evidence.service";
import { EventsService } from "../../services/events.service";
import { UsersService } from "../../services/users.service";
import { MatAccordion } from '@angular/material';
import { ProjectsService } from '../../services/projects.service';
import { ActivatedRoute } from "@angular/router";
import * as jsPDF from 'jspdf'
import { TopbarComponent } from "../topbar/topbar.component";
import { configPdf } from '../configuration/configuration.component';
import { AngularFirestore } from '@angular/fire/firestore';


import { PdfService } from "../../services/pdf.service";

import { MatCheckbox } from "@angular/material";
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

  public checked : boolean = false;
  projects: any;

  @ViewChildren('checkbox') allcheck : any;

  lockProjects: boolean = false
  lockEvents: boolean = false;  //bloquea tabla de evidencia ante cualquier cambio en el observable
  lockActivities: boolean = false;
  lockEvidence: boolean = false
  //selected
  proySelect = ""
  actSelect = ""
  eventSelect = ""

  idEvent = "";
  idUser = "";
  loading: boolean = true;

  indexExpanded: number = -1;

  @ViewChild('content') content: ElementRef;
  public image = {} as image;
  // items: GalleryItem[];
  evidenceCollection: any[];
  eventsCollection: any[];
  activitiesCollection: any[];
  usersCollection: any[];
  @ViewChild('myaccordion') myPanels: MatAccordion;
  configPdf = {} as configPdf;
  timerPDF: any;

  constructor(

    // public gallery: Gallery, 
    private _route: ActivatedRoute,
    public projectService: ProjectsService,
    public pdfservice : PdfService,
    public evidenceService: EvidenceService,
    public eventsService: EventsService,
    public usersService: UsersService,
    public activitiesService: ActivitiesService,
    public db: AngularFirestore,
    public topbar: TopbarComponent) {

    this._route.paramMap.subscribe((route: any) => {
      if (route.params.id) {
        console.log(route.params.id)
        // this.projects = [];
        this.lockEvidence = false;
        this.loading = true;

        this.projectService.getProjects().subscribe(projects => {
          this.projects = projects
        })
        this.eventsService.getEventById(route.params.id).then((event:any) =>{

          this.activitiesService.getActivity(event.activity_id).then((activity:any)=>{

            this.projectService.getProject(activity.project_id).then((project:any)=>{
              this.selectProject(project);
              this.selectActivity(activity);
              this.selectEvent(event);
            })

          })

        }).catch((err)=>{
          console.log(err)
        })
       
      }else{
        this.projectService.getProjects().subscribe(projects => {
          this.projects = projects
          this.loading = false;
          this.lockProjects = true;
        })
      } 
    })

    this.image.ubication = {
      lat: 0,
      lng: 0
    }

    // this.projects = th|is.topbar.projects;
  }



  ngOnInit() {

  //  this.pdfservice.getPDF().then( res => console.log(res))
  //                          .catch(err => console.log(err));
                            

    this.db.collection('configuration').doc('pdf').ref.get().then(doc => {
      this.configPdf = doc.data() as configPdf;
    }).catch(err => {
      console.log('error inesperado: ' + err)
    })

    // this.evidenceService.getEvidence().subscribe(evidence => {
    //   this.evidenceCollection = evidence;
    //   this.loading = false;
    // })

    this.usersService.getUsers().subscribe(users => {
      this.usersCollection = users
    })


  }

  selectProject(project) {
    // this.loading = true;
    this.lockProjects = false;
    this.lockActivities = true;
    this.proySelect = project.title;
    this.activitiesService.getActivitiesByProject(project.id).subscribe(activities => {
      this.activitiesCollection = activities;
      // this.loading = false;
      // console.log(activities)
    })
  }

  selectActivity(activity) {
    // this.loading = true;
    this.lockEvents = true;
    this.lockActivities = false;
    this.actSelect = activity.title;
    this.eventsService.getEventsByActivity(activity.id).subscribe(events => {
      this.eventsCollection = events;
      // this.loading = false;

      // console.log(events)
    })
  }

  selectEvent(event) {
    // this.loading = true;
    this.lockEvidence = true;
    this.lockEvents = false;
    this.eventSelect = event.title;
    this.evidenceService.getEvidenceByEvent(event.id).subscribe(evidence => {
      evidence.map(ev => {
        ev.selected = false;
      })
      this.evidenceCollection = evidence;
      console.log(this.evidenceCollection)
      this.loading = false;

    })
  }


  filterProjects(e) {

    this.projectService.getProjectsFilter(e.target.value).subscribe(projs => {
      this.projects = projs;
    })

    // console.log(``)
  }

  getEtapa(etapa) {

    switch (etapa) {
      case 'before':
        return 'Antes'
        break;
      case 'during':
        return 'Durante'
        break;
      case 'after':
        return 'Después'
        break;

      default:
        return ''
        break;
    }
  }




  readEvidence(event, index: number) {
    this.indexExpanded = index == this.indexExpanded ? -1 : index;
    if (!event.read) {
      this.evidenceService.readNotification(event.id).then(res => {
      }).catch(err => console.log(err))
    }
  }



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


    $('#loading').modal({backdrop: 'static', keyboard: false});

    let doc = new jsPDF();
    var page = 1;
    let content = '<p>' + evidence.description + '</p>';
    // console.log(e)
    let specialElementhandlers = {
      '#editor': function (element, renderer) {
        return true
      }
    };


    // doc.setFont('courier')
    doc.setFontType('bold')
    doc.text(70, 20, this.configPdf.text_header)
    doc.text(55, 293, this.configPdf.text_footer)
    

    doc.setFontType('normal')
    doc.setFontSize(14)
    doc.text(10, 40, ('Fecha : ' + new Date().toDateString()));
    doc.text(10, 50, ('Descripción : '));
    doc.fromHTML(content, 10, 50, {
      width: 190,
      'elementHandlers': specialElementhandlers
    });
    doc.text(170,293, 'página ' + page);
    page ++;


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

      doc.addImage(image, "JPG", 10, 10, (img.width * 0.10), (img.height * .10));

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


    var xx = 70;
    var cont = 1;
    var tam = evidence.multimedia.length;

    evidence.multimedia.forEach(imagen => {
     if(imagen.type == 'image') 
        {   var image;
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

              if (xx + (img.height * 0.20) + 5 > 293) {
                doc.addPage();
                cont = 1
                xx = 5;
                doc.text(170,293, 'página ' + page);
                page ++;
                // console.log('se añadio pagina')
              }

              image = dataURL.replace(/^data:image\/(png|jpg);base64,/, "");

              doc.addImage(image, "JPG", 50, xx, (img.width * 0.20), (img.height * .20));

              cont = cont + 1;
              xx = xx + (img.height * 0.20) + 5;
              // console.log(xx)
            };
        }

    });

    this.timerPDF =setTimeout(() => {
      doc.save('Test.pdf');
      $('#loading').modal('hide');
    }, tam * 1500 + 2000);
    //   setTimeout(() => {
    //   doc.save('Test.pdf');
    // }, 3000);

  }
  

  cancelExport(){
    clearTimeout(this.timerPDF);
  }


  getPDF(evidence){
console.log(evidence);




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
    var settings = {
      "async": true,
      "crossDomain": true,
      "url": "https://cors-anywhere.herokuapp.com/http://bb1857de.ngrok.io/pdf",
      "method": "POST",
      "headers": {
        "Content-Type": "application/json",
        "Authorization": "key=AAAAj8zqaUE:APA91bERYCowiiiRXxOgRLH3hTGjbz-0AJrfaUtGEWUflAD5HrtwHmvo4qRV18G-hLBmoNtDOyRBzBv8ouEJvredPC4JXmjgSh4d-l9lEQ9XS-UabYW2wZna92YAWKNhZShZAopFwF8M",
        // "": "",
        "cache-control": "no-cache",
        // "Postman-Token": "f1781394-9242-4787-b62a-198a2d3340c3"
      },
      "processData": false,
      // "data": ""
    }
    
    $.ajax(settings).done(function (data) {
      
      var blob=new Blob([data]);
      var link=document.createElement('a');
      link.href=window.URL.createObjectURL(blob);
      link.download="test.pdf";
      link.click();

    });
    
  }

  openAll() {
    this.myPanels.openAll();
  }

  closeAll() {
    this.myPanels.closeAll();
  }

  showImage(evidence, index) {
   this.image.type == 'imagen';
    this.image = evidence.multimedia[index];
    $('#showimage').modal('show');
    console.log(evidence.multimedia[index]);
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

  // backAct(){
  //   this.activitiesCollection = null
  //    this.actSelect = ''
  // }

  selectAll(option:boolean) {
   
    this.checked = option;

    this.allcheck.map( check => {
      check.checked = option;
      console.log(check);
      
    })
  }

  async exportPDF(){
    
    let array_check = this.allcheck.filter(function (check) {
      return check.checked == true
       });

    const events_check = await array_check.map( event => {
         return event.name;
       })

       console.log(events_check)
      //  this.export(array_check[0].name);
  }


}
