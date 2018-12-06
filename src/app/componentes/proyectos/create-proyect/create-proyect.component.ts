import { Component, OnInit } from '@angular/core';
import { ProjectsService } from "../../../services/projects.service";
// import { snapshotChanges } from '@angular/fire/database';
// import { TagInputModule } from 'ng-tags-input';
// import * as $ from 'jquery/dist/jquery.min.js';



import { NotifierService } from 'angular-notifier';
import { project } from 'src/app/models/project';


declare var $:any;

@Component({
  selector: 'app-create-proyect',
  templateUrl: './create-proyect.component.html',
  styleUrls: ['./create-proyect.component.css']
})
export class CreateProyectComponent implements OnInit {
  
  private readonly notifier: NotifierService;
 
  projects: project[];
  projectDoc = {} as project;

  
  constructor(public projectsService: ProjectsService, notifierService: NotifierService) {
    this.notifier = notifierService;
    // this.projectDoc.name = "";
  }

  ngOnInit() {

    this.projectsService.getProjects().subscribe(items =>{
      this.projects = items;
      console.log(this.projects)
    })
  }

addProject()
{
  console.log(this.projectDoc);
  // this.projectsService.saveProject(this.project)
}
  
}
