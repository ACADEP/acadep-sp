import { Component, OnInit, ViewChild } from '@angular/core';
import { ProjectsService } from "../../../services/projects.service";
import { ActivitiesService } from "../../../services/activities.service";
import { EventsService } from "../../../services/events.service";
import { UsersService } from "../../../services/users.service";
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, combineLatest } from "rxjs";
import { Subject } from "rxjs/";
import { MouseEvent, MarkerManager } from '@agm/core';
import { NotifierService } from 'angular-notifier';
import { project } from 'src/app/models/project';
import { User } from 'src/app/models/user';
// import { datetime } from 'src/app/models/dateTime';
import { marker } from "../../../models/marker";

import * as XLSX from 'xlsx';
import { isNullOrUndefined } from 'util';
import { element } from '@angular/core/src/render3';
type AOA = any[][];

declare var $: any;

interface projExcel {
  name: string,

  activities: actExcel[]
  subprojects: string[]
}
interface actExcel {
  name: string,
  subproject: string,
  events: eventExcel[],
  //  project_id : string
}
interface eventExcel {
  name: string,
  description: string,
  unit: string,
  number: number,
  user_mail: string
  // activiy_id : string
}

@Component({
  selector: 'app-create-proyect',
  templateUrl: './create-proyect.component.html',
  styleUrls: ['./create-proyect.component.css']
})
export class CreateProyectComponent implements OnInit {

  private readonly notifier: NotifierService;
  // marker: marker = {} as marker;

  objectExcel = {} as projExcel;

  public sub: boolean = false;
  public subproject: string;


  searchterm: string;
  startAt = new Subject();
  endAt = new Subject();

  clubs;
  allclubs;
  startobs = this.startAt.asObservable();
  endobs = this.endAt.asObservable();

  projects: project[];
  users: User[];
  projectDoc = {} as project;
  editProjectDoc = {} as project;
  query: string;

  constructor(
    public projectsService: ProjectsService,
    notifierService: NotifierService,
    public userservice: UsersService,
    private afs: AngularFirestore,
    public activitiesService: ActivitiesService,
    public eventsService: EventsService) {

    // this.marker.label = 'myPosition';
    this.notifier = notifierService;

    this.projectDoc.start = new Date().toJSON();
    this.projectDoc.end = new Date().toJSON();
    // this.editProjectDoc.start = {} as datetime;
    // this.editProjectDoc.end = {} as datetime;

    this.projectDoc.ubication = {} as marker;
    this.editProjectDoc.ubication = {} as marker;
    this.projectDoc.subprojects = [];
    this.objectExcel.activities = [];


  }

  ngOnInit() {
    this.findMe();

    this.projectsService.getProjects().subscribe((clubs) => {
      this.allclubs = clubs;
      this.clubs = clubs;
    })

    combineLatest(this.startobs, this.endobs).subscribe((value) => {
      this.firequery(value[0], value[1]).subscribe((clubs) => {
        this.clubs = clubs;
      })
    })

    this.userservice.getUsers().subscribe(items => {
      this.users = items;
    })

  }


  checkSub() {
    if (this.sub == false) {
      this.sub = true;
    } else {
      this.sub = false;

    }
  }
  async PushSubproject() {
    await this.projectDoc.subprojects.push(this.subproject);
    this.subproject = '';
  }


  findMe() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.projectDoc.ubication.lat = position.coords.latitude;
        this.projectDoc.ubication.lng = position.coords.longitude;
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }

  markerDragEnd($event: MouseEvent) {
    console.log($event.coords)
    this.projectDoc.ubication.lat = $event.coords.lat;
    this.projectDoc.ubication.lng = $event.coords.lng;
  }
  EditmarkerDragEnd($event: MouseEvent) {
    console.log($event.coords)
    this.editProjectDoc.ubication.lat = $event.coords.lat;
    this.editProjectDoc.ubication.lng = $event.coords.lng;
  }


  addProject() {

    if (this.sub == false) {
      this.projectDoc.subprojects = []
    }

    this.projectsService.saveProject(this.projectDoc).then((result) => {
      this.notifier.notify('success', 'Proyecto creado!');

      this.projectDoc.title = "";
      this.projectDoc.administrators = [];
      this.projectDoc.description = "";
      this.projectDoc.start = new Date().toJSON();
      this.projectDoc.end = new Date().toJSON();
      this.projectDoc.subprojects = [];
      this.sub = false;

    }).catch((err) => {
      this.notifier.notify('error', 'Opps! algo salío mal');
    });
  }

  toogleProjects() {
    if ($('#btncolapse').hasClass('fa-plus-circle')) {
      $('#btncolapse').removeClass('fa-plus-circle');
      $('#btncolapse').addClass('fa-minus-circle');
    } else {
      $('#btncolapse').removeClass('fa-minus-circle');
      $('#btncolapse').addClass('fa-plus-circle');
    }

    $('.fa-chevron-down').trigger('click');
  }

  editProject(project) {
    this.editProjectDoc = project;
    $('#modalEdit').modal('show');
  }

  updateProject() {
    this.projectsService.updateProject(this.editProjectDoc).then(() => {
      $('#modalEdit').modal('hide');
      this.notifier.notify('success', 'Actualizado correctamente!');
    }).catch(() => {
      this.notifier.notify('error', 'Opps! algo salío mal');
    });
  }


  objectValues(obj) {
    return Object.values(obj);
  }

  onDeleteProject(project) {
    if (confirm("Está seguro que desea eliminar " + project.title)) {
      this.projectsService.deleteProject(project.id).then((result) => {
        this.notifier.notify('success', 'Proyecto eliminado!');
      }).catch((err) => {
        this.notifier.notify('error', 'Opps! algo salío mal');
      });
    }
  }

  search($event) {
    let q = $event.target.value;
    if (q != "") {
      this.startAt.next(q);
      this.endAt.next(q + "\uf8ff");
    }
    else {
      this.clubs = this.allclubs;
    }
  }


  firequery(start, end) {
    return this.afs.collection('projects', ref => ref.orderBy('name').startAt(start).endAt(end)).valueChanges();
  }

  getallclubs() {
    return this.afs.collection('projects', ref => ref.orderBy('name')).valueChanges();
  }

  /*
  **
  importar excel
  
  */

  data: AOA = [];
  wopts: XLSX.WritingOptions = { bookType: 'xlsx', type: 'array' };
  fileName: string = 'SheetJS.xlsx';

  onFileChange(evt: any) {
    /* wire up file reader */
    const target: DataTransfer = <DataTransfer>(evt.target);
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      /* read workbook */
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
      //  console.log(wb)

      /* grab first sheet */
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];
      //  console.log(wb);

      /* save data */
      const array = <AOA>(XLSX.utils.sheet_to_json(ws, { header: 1 }));

      this.constructObject(array, wsname);
      // console.log(array)
    };
    reader.readAsBinaryString(target.files[0]);
  }


  export(): void {
    /* generate worksheet */
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(this.data);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, this.fileName);
  }



  jsonToFirebase(json: any, total: number) {
    // //  console.log(json)
    var cont = 1;
    this.projectsService.importProject(json.name, json.subprojects).then((project: any) => {
      cont++;
      console.log(cont + '/' + total)
      json.activities.forEach(activity => {
        this.activitiesService.ImportActivity(activity.name, project.id, activity.subproject).then((res: any) => {
          cont++;
          console.log(cont + '/' + total)
          activity.events.forEach(event => {
            this.eventsService.ImportEvent(event.name, event.unit, event.number, res.id, event.user_mail).then(() => {
              cont++;
              console.log(cont + '/' + total)
            }).catch(err1 => {
              console.log(err1);
            })
          });
        }).catch(err2 => {
          console.log(err2);
        })
      });
    }).catch(err3 => {
      console.log(err3);
    })

  }


  async constructObject(array, name) {


    var doc = {} as projExcel;
    doc.name = name;
    doc.activities = [];
    doc.subprojects = [];

    var contSub = -1;
    var contAct = -1;

    const arr = await array.map(element => {
      if (element[0] == 'subproyecto' || element[0] == 'Subproyecto') {
        doc.subprojects.push(element[1]);
        contSub++
      }

      if (element[0] == 'actividad' || element[0] == 'Actividad') {
        contAct++;
        const act: actExcel = {
          name: element[1],
          subproject: doc.subprojects[contSub],
          events: []
        }

        doc.activities.push(act)
      }

      if (element[0] == 'evento' || element[0] == 'Evento') {

        const event: eventExcel = {
          name: element[1],
          description: '',
          unit: element[5],
          number: element[6],
          user_mail: element[4]
        }

        doc.activities[contAct].events.push(event);
      }

    })

    this.jsonToFirebase(doc, arr.length);



    //   var doc = {} as projExcel;
    //   doc.name = array[2][1];

    //   doc.activities = [];
    //   // var act = {} as actExcel;
    //  var indexAct = 0;

    //   array.forEach(function (element, index) {
    //     if (index > 2 && isNullOrUndefined(element[5])) {

    //       if(index != 0){
    //         indexAct = indexAct + 1;
    //       }
    //       const activity = {
    //         name: element[1],
    //         events: []
    //       }
    //       // activity.events = [];
    //       // console.log(activity)

    //       doc.activities.push(activity);
    //       // this..activities.push(act);

    //       // console.log('actividad: '+ element[1])
    //     } else if (index > 2 && !isNullOrUndefined(element[2]) && !isNullOrUndefined(element[3])) {

    //       const event : eventExcel = {
    //         name : element[0],
    //         description : element[1],
    //         unit : element[2],
    //         number : element[3]

    //       }
    //       // console.log(indexAct)

    //     // console.log(doc.activities[indexAct-1])

    //       doc.activities[indexAct-1].events.push(event);

    //     }

    //     // console.log(index, array.length)

    //   });

    //     this.jsonToFirebase(doc);

    // }


  }
}
