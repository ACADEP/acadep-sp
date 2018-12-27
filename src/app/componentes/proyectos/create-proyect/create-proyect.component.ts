import { Component, OnInit } from '@angular/core';
import { ProjectsService } from "../../../services/projects.service";
import { UsersService } from "../../../services/users.service";
import {  AngularFirestore } from '@angular/fire/firestore';
import { Observable, combineLatest } from "rxjs";
import { Subject } from "rxjs/";
// import { snapshotChanges } from '@angular/fire/database';
// import { TagInputModule } from 'ng-tags-input';
// import * as $ from 'jquery/dist/jquery.min.js';



import { NotifierService } from 'angular-notifier';
import { project } from 'src/app/models/project';
import { User } from 'src/app/models/user';
import { TitleCasePipe } from '@angular/common';


declare var $:any;

interface admin{
  id:string;
  name:string;
}

@Component({
  selector: 'app-create-proyect',
  templateUrl: './create-proyect.component.html',
  styleUrls: ['./create-proyect.component.css']
})
export class CreateProyectComponent implements OnInit {
  
  private readonly notifier: NotifierService;
 
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

  
  constructor(public projectsService: ProjectsService, notifierService: NotifierService,
   public userservice : UsersService, private afs : AngularFirestore) {
    this.notifier = notifierService;
    // this.projectDoc.name = "";
  }

  ngOnInit() {

    this.projectsService.getProjects().subscribe((clubs) => {
      this.allclubs = clubs;
      this.clubs = clubs;
       
    })

     
     combineLatest(this.startobs, this.endobs).subscribe((value) => {
      this.firequery(value[0], value[1]).subscribe((clubs) => {
        this.clubs = clubs;
      })
    })

   
    this.userservice.getUsers().subscribe(items =>{
      this.users = items;
      // console.log(this.users)
    })


  }

addProject()
{
  this.projectsService.saveProject(this.projectDoc).then((result) => {
    this.notifier.notify( 'success', 'Proyecto creado!' );
    this.projectDoc.name = "";
    this.projectDoc.administrators = [];
    this.projectDoc.description = "";
    this.projectDoc.ubication = null;
    this.projectDoc.start = null;
    this.projectDoc.end = null;

  }).catch((err) => {
    this.notifier.notify( 'error', 'Opps! algo salío mal' );

  });
}

toogleProjects()
  {

    if ($('#btncolapse').hasClass('fa-plus-circle')) {
      $('#btncolapse').removeClass('fa-plus-circle');
      $('#btncolapse').addClass('fa-minus-circle');
    } else {
      $('#btncolapse').removeClass('fa-minus-circle');
      $('#btncolapse').addClass('fa-plus-circle');

    }

    $('.fa-chevron-down').trigger('click');
    
  }


openActivities()
{
  alert("en proceso")

}
editProject(project)
{

  this.editProjectDoc = project;
  $('#modalEdit').modal('show');
}

updateProject()
{
  this.projectsService.updateProject(this.editProjectDoc).then(() => {
    $('#modalEdit').modal('hide');
    this.notifier.notify( 'success', 'Actualizado correctamente!' );

  }).catch(() => {
    this.notifier.notify( 'error', 'Opps! algo salío mal' );

  });
}


objectValues(obj) {
    return Object.values(obj);
  }

  onDeleteProject(project){

     if(confirm("Está seguro que desea eliminar "+project.name)) {
       
      this.projectsService.deleteProject(project.id).then((result) => {
        this.notifier.notify( 'success', 'Proyecto eliminado!' );
      }).catch((err) => {
        this.notifier.notify( 'error', 'Opps! algo salío mal' );
      });  
     
     }
    }

  search($event) {
    let q = $event.target.value;
    if (q !=  "") {
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
