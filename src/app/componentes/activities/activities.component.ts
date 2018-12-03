import { Component, OnInit } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { ActivitiesService } from "../../services/activities.service";
import { ProjectsService } from "../../services/projects.service";
import { utimes } from 'fs';
import { isNgTemplate } from '@angular/compiler';

declare var $: any;

@Component({
  selector: 'app-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.css']
})
export class ActivitiesComponent implements OnInit {
  private readonly notifier: NotifierService;
  activitiesListArray: any[];
  projectsListArray: any[];

  activityTypes = [

    'auditoria',
    'servicio',
    'supervision'

  ];



  public time: Boolean;
  public tool: string;

  //activity

  public name: string;
  public type: string;
  public project_id: string;
  public description: Text;
  public start: Date;
  public end: Date;
  public tools = [];

  constructor(notifierService: NotifierService, public activitiesService: ActivitiesService,
    public projectsService: ProjectsService) {
    this.notifier = notifierService;
    this.time = false;
    this.type = "";


  }

  ngOnInit() {

    // this.type = "";

    //proyectos
    this.projectsService.getProjects().snapshotChanges()
      .subscribe(item => {
        this.projectsListArray = [];
        item.forEach(element => {
          let x = element.payload.toJSON();
          x['$key'] = element.key;
          this.projectsListArray.push(x);
        });
      })

    //actividades
    this.activitiesService.getActivities().snapshotChanges()
      .subscribe(item => {
        this.activitiesListArray = [];
        item.forEach(element => {
          let x = element.payload.toJSON();

          if (x['active'] == true) {
            x['$key'] = element.key;
            this.projectsService.getProyect(x['project_id']).then(function (res: any) {
              x['project_name'] = res.name;
            })
            this.activitiesListArray.push(x);
          }
          
        });
      })

  }

  addActivity() {
    this.activitiesService.addActivity(this.name, this.project_id, this.description, this.type, this.start, this.end, this.tools).then(() => {
      this.notifier.notify('success', 'Actividad Registrada!');
    }).catch(() => {
      this.notifier.notify('error', 'No se pudo Registrar Actividad!');
    });
    // console.log(this.name, this.type, this.description, this.project_id, this.start, this.end, this.tools)
  }

  objectValues(obj) {
    return Object.values(obj);
  }


  pushTool() {
    // alert(value);

    this.tools.push(this.tool);
    this.tool = '';
  }

  deleteTool(item) {
    const index = this.tools.indexOf(item);
    this.tools.splice(index, 1);
  }

  onDeleteActivity(item) {
    // console.log(item)
    this.activitiesService.deleteActivity(item.$key);
  }

  getProyect(item) {

    this.projectsService.getProyect(item.project_id).then((result: any) => {
      return result.name;
    }).catch((err) => {
      console.log(err)
    });
  }

}
