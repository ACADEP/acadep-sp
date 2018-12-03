import { Component, OnInit } from '@angular/core';
import { ProjectsService } from "../../../services/projects.service";
// import { snapshotChanges } from '@angular/fire/database';
// import { TagInputModule } from 'ng-tags-input';
// import * as $ from 'jquery/dist/jquery.min.js';



import { NotifierService } from 'angular-notifier';


declare var $:any;

@Component({
  selector: 'app-create-proyect',
  templateUrl: './create-proyect.component.html',
  styleUrls: ['./create-proyect.component.css']
})
export class CreateProyectComponent implements OnInit {
  projectListArray: any[];
  userListArray: any[];

  private readonly notifier: NotifierService;

  public name: string = '';
  public description: string = '';
  public ubication: string = '';
  public inicio: string = '';
  public final: string = '';
  public administrador: string;
  // public empleado: string = '';

  public key:string;
  public editName: string;
  public editDescription: string;
  public editUbication: string;
  public editInicio: string;
  public editFinal: string;
  public editAdministrador: string;
  // public empleado: string;
  constructor(public projectsService: ProjectsService, notifierService: NotifierService) {
    this.notifier = notifierService;

  }

  ngOnInit() {
    this.projectsService.getProjects().snapshotChanges()
      .subscribe(item => {
        this.projectListArray = [];
        item.forEach(element => {
          let x = element.payload.toJSON();
          x['$key'] = element.key;
          this.projectListArray.push(x);
        });
      })

    this.projectsService.getUsers().snapshotChanges()
      .subscribe(item => {
        this.userListArray = [];
        item.forEach(element => {
          let x = element.payload.toJSON();
          x['$key'] = element.key;
          this.userListArray.push(x);
        });
      })


    
   

  }
  



  addProject() {

    if (this.name != "" && this.description != "" && this.ubication != "" && this.inicio != "" && this.final !="" && this.administrador != "" ) {
      this.projectsService.addProject(this.name, this.description, this.ubication, this.inicio, this.final, this.administrador);
    } else {
      this.notifier.notify('error', 'Faltan datos!')

    }
    // if (this.name == undefined || this.description == undefined) {
    //   this.notifier.notify( 'error', 'Escriba un nombre para el proyecto' )

    // } else {
    // }


  }

  editProject(project) {
    this.key = project.$key;
     this.editName = project.name;
     this.editDescription = project.description;
     this.editInicio = project.inicio;
     this.editFinal = project.final;
     this.editUbication = project.ubication;
    console.log(project)
    $('#modalEdit').modal('show');
  }

  onUpdateProject(e)
  {
    e.preventDefault();
    this.projectsService.updateproject(this.key, this.editName, this.editDescription, this.editUbication, this.editInicio, this.editFinal);
    $('#modalEdit').modal('hide');
    this.notifier.notify( 'success', 'Usuario Actualizado!' );

  }

}
