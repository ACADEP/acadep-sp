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
import { NgForm } from '@angular/forms';
type AOA = any[][];

declare var $: any;


interface projExcel {
  name: string,

  activities: actExcel[]
  fecha_inicio: string
  fecha_final: string
  // subprojects: string[]
}
interface actExcel {
  name: string,
  // subproject: string,
  events: eventExcel[]
  project_id?: string
  fecha_inicio: string
  fecha_final: string
}
interface eventExcel {
  fecha_inicio: string
  fecha_final: string
  activity_name?: string
  name: string,
  description: string,
  activity_id?: string
  unit: string
  number: number
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

  // public sub: boolean = false;
  public subproject: string;

  loading: boolean = true;

  percent = '0%';

  loadingLine: boolean = false;
  // searchterm: string;
  // startAt = new Subject();
  // endAt = new Subject();

  // clubs;
  // allclubs;
  // startobs = this.startAt.asObservable();
  // endobs = this.endAt.asObservable();

  projects: project[];
  users: User[];
  projectDoc = {} as project;
  editProjectDoc = {} as project;
  proyectAsign = {} as project;
  // query: string;

  constructor(
    private afs: AngularFirestore,
    notifierService: NotifierService,
    public userservice: UsersService,
    public projectsService: ProjectsService,
    public activitiesService: ActivitiesService,
    public eventsService: EventsService) {

    // this.marker.label = 'myPosition';
    this.notifier = notifierService;
    this.projectDoc.start = new Date().toJSON();
    this.projectDoc.end = new Date().toJSON();
    this.projectDoc.ubication = {} as marker;
    this.editProjectDoc.ubication = {} as marker;
    this.objectExcel.activities = [];

  }

  ngOnInit() {
    this.findMe();
    this.projectsService.getProjects().subscribe((projects) => {
      this.projects = projects;
      this.loading = false;
    })
    this.userservice.getUsers().subscribe(users => {
      this.users = users;
    })
  }

  openAsign(project) {
    console.log(project);
    this.proyectAsign = project;
    $('#asign').modal('show');
  }

  toDoAsign(form: NgForm) {

    if (form.valid) {
      const user_id = form.value.user_asign;
      $('#error_asign').hide();
      if (confirm("Está seguro que desea asignar todos los eventos de " + this.proyectAsign.title + "?")) {
        this.loadingLine = true;
        this.activitiesService.getActivitiesByProjectNotObservable(this.proyectAsign.id).then((acts: any) => {
          acts.docs.map((activity, index) => {
            this.activitiesService.asignActivity(activity.id, user_id).then(() => {
              // console.log(acts.docs.length, index)
              if (acts.docs.length == (index + 1)) {
                $('#asign').modal('hide');
                this.notifier.notify('success', 'Asignación correcta!');
                setTimeout(() => {
                  this.loadingLine = false;
                }, 200);
              }
            })
          })
        })
      }
    }
    else {
      $('#error_asign').show();
    }
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
    this.projectsService.saveProject(this.projectDoc).then((result) => {
      this.notifier.notify('success', 'Proyecto creado!');
      this.projectDoc.title = "";
      this.projectDoc.administrators = [];
      this.projectDoc.description = "";
      this.projectDoc.start = new Date().toJSON();
      this.projectDoc.end = new Date().toJSON();
      // this.sub = false;

    }).catch((err) => {
      this.notifier.notify('error', 'Verifique su conexión a internet');
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
      this.notifier.notify('error', 'Verifique su conexión a internet');
    });
  }


  objectValues(obj) {
    return Object.values(obj);
  }

  onDeleteProject(project) {
    if (confirm("Está seguro que desea eliminar " + project.title)) {
      this.projectsService.deleteProject(project.id).then(() => {
        this.notifier.notify('success', 'Proyecto eliminado!');
      }).catch(() => {
        this.notifier.notify('error', 'Opps! algo salío mal');
      });
    }
  }

  /*
  **
  importar excel
  
  */

  data: AOA = [];
  wopts: XLSX.WritingOptions = { bookType: 'xlsx', type: 'array' };
  fileName: string = 'SheetJS.xlsx';

  onFileChange(evt: any) {
    const OnlyExtensions = ['xlsx', 'csv']
    const extensionFile = evt.target.files[0].name.split('.').pop();

    if (OnlyExtensions.includes(extensionFile)) {
      const target: DataTransfer = <DataTransfer>(evt.target);
      if (target.files.length == 1) {

        const reader: FileReader = new FileReader();
        reader.onload = (e: any) => {
          const bstr: string = e.target.result;
          const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
          const wsname: string = wb.SheetNames[0];
          const ws: XLSX.WorkSheet = wb.Sheets[wsname];
          const array = <AOA>(XLSX.utils.sheet_to_json(ws, { header: 1 }));
          this.constructObject(array, wsname);
        };
        reader.readAsBinaryString(target.files[0]);

      } else {
        throw new Error('No se permiten multiples archivos');
      }
    } else {
      throw new Error('Extension no valida');
    }
    
  }


  export(): void {
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(this.data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, this.fileName);
  }


  jsonToFirebase(json: any, total: number) {
    console.log(json)
    console.log(total)

    // Descomentar cuando termine test

    // var cont = 0;  
    // json.map((project: projExcel) => {
    //   this.projectsService.importProject(project).then((proj: any) => {
    //     project.activities.map((activity: actExcel) => {
    //       activity.project_id = proj.id;
    //       this.activitiesService.ImportActivity(activity).then((act: any) => {
    //         activity.events.map((event: eventExcel) => {
    //           event.activity_name = activity.name;
    //           event.activity_id = act.id;
    //           this.eventsService.ImportEvent(event).then(final => {
    //             cont++;
    //             let percentage = Math.round((100 * cont) / total) + '%';
    //             this.percent = percentage;
    //             console.log(Math.round((100 * cont) / total) + '%')
    //           })
    //         })
    //       })
    //     })
    //   }).catch((err) => { console.log(err) });
    // })
  }


  async constructObject(array, name) {
    var container = [];
    // var doc = {} as projExcel;
    // doc.name = name;
    // doc.activities = [];
    // doc.subprojects = [];
    var contSub = -1;
    var contAct = -1;
    var contEvent = 0;

    const arr = await array.map(element => {
      if (element[0] == 'subproyecto' || element[0] == 'Subproyecto') {
        const sub: projExcel = {
          name: element[1],
          activities: [],
          fecha_inicio: this.convertDate(element[2]),
          fecha_final: this.convertDate(element[3]),
        }
        container.push(sub);
        contSub++
        contAct = -1;
      }

      if (element[0] == 'actividad' || element[0] == 'Actividad') {
        contAct++;
        const act: actExcel = {
          name: element[1],
          events: [],
          fecha_inicio: this.convertDate(element[2]),
          fecha_final: this.convertDate(element[3]),
        }

        container[contSub].activities.push(act)
      }

      if (element[0] == 'evento' || element[0] == 'Evento') {

        contEvent++;
        const event: eventExcel = {
          name: element[1],
          description: '',
          unit: element[5],
          number: element[6],
          user_mail: element[4],
          fecha_inicio: this.convertDate(element[2]),
          fecha_final: this.convertDate(element[3]),
        }

        container[contSub].activities[contAct].events.push(event);

      }

    })

    this.jsonToFirebase(container, contEvent);
  }


  convertDate(excelDate) {

    // JavaScript dates can be constructed by passing milliseconds
    // since the Unix epoch (January 1, 1970) example: new Date(12312512312);

    // 1. Subtract number of days between Jan 1, 1900 and Jan 1, 1970, plus 1 (Google "excel leap year bug")             
    // 2. Convert to milliseconds.

    return new Date((excelDate - (25567 + 1)) * 86400 * 1000).toJSON()

  }
}
