import { Component, OnInit } from '@angular/core';
import { ProjectsService } from "../../../services/projects.service";
import { UsersService } from "../../../services/users.service";
// import { snapshotChanges } from '@angular/fire/database';
// import { TagInputModule } from 'ng-tags-input';
// import * as $ from 'jquery/dist/jquery.min.js';



import { NotifierService } from 'angular-notifier';
import { project } from 'src/app/models/project';
import { User } from 'src/app/models/user';


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
 

  projects: project[];
  users: User[];
  projectDoc = {} as project;
    query: string;

  
  constructor(public projectsService: ProjectsService, notifierService: NotifierService,
   public userservice : UsersService) {
    this.notifier = notifierService;
    // this.projectDoc.name = "";
  }

  ngOnInit() {

    this.projectsService.getProjects().subscribe(items =>{
      this.projects = items;
      // console.log(this.projects)
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

objectValues(obj) {
    return Object.values(obj);
  }

  onDeleteProject(project){
    this.projectsService.deleteProject(project.id).then((result) => {
      this.notifier.notify( 'success', 'Proyecto eliminado!' );

    }).catch((err) => {
      this.notifier.notify( 'error', 'Opps! algo salío mal' );

    });
  }

  searchByName()
  {
    this.projectsService.searchProjects(this.query).subscribe(items =>{
      this.projects = items;
       console.log(this.projects)
    })
  }


  
}
