import { Component, OnInit, ViewChild } from '@angular/core';
import { ProjectsService } from "../../../services/projects.service";
import { UsersService } from "../../../services/users.service";
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, combineLatest } from "rxjs";
import { Subject } from "rxjs/";
import { MouseEvent, MarkerManager } from '@agm/core';
import { NotifierService } from 'angular-notifier';
import { project } from 'src/app/models/project';
import { User } from 'src/app/models/user';
import { datetime } from 'src/app/models/dateTime';
import { marker } from "../../../models/marker";

declare var $: any;

@Component({
  selector: 'app-create-proyect',
  templateUrl: './create-proyect.component.html',
  styleUrls: ['./create-proyect.component.css']
})
export class CreateProyectComponent implements OnInit {

  private readonly notifier: NotifierService;
  // marker: marker = {} as marker;

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
    private afs: AngularFirestore) {

    // this.marker.label = 'myPosition';
    this.notifier = notifierService;
    this.projectDoc.start = {} as datetime;
    this.projectDoc.end = {} as datetime;
    this.editProjectDoc.start = {} as datetime;
    this.editProjectDoc.end = {} as datetime;

    this.projectDoc.ubication = {} as marker;
    this.editProjectDoc.ubication = {} as marker;
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
      this.projectDoc.name = "";
      this.projectDoc.administrators = [];
      this.projectDoc.description = "";
      this.projectDoc.ubication = null;
      this.projectDoc.start.date = "";
      this.projectDoc.start.time = "";
      this.projectDoc.end.date = "";
      this.projectDoc.end.time = "";
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
    if (confirm("Está seguro que desea eliminar " + project.name)) {
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

}
