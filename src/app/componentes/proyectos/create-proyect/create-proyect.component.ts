import { Component, OnInit } from '@angular/core';
import { ProjectsService } from "../../../services/projects.service";
import { snapshotChanges } from '@angular/fire/database';
import { element } from 'protractor';
import { NotifierService } from 'angular-notifier';


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
  public administrador: string = '';
  public empleado: string = '';
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
    // if (this.name == undefined || this.description == undefined) {
    //   this.notifier.notify( 'error', 'Escriba un nombre para el proyecto' )

    // } else {
      this.projectsService.addProject(this.name, this.description, this.ubication, this.inicio, this.final, this.administrador, this.empleado);
      this.notifier.notify( 'success', 'Proyecto Guardado!' )
    // }
  

  }

}
