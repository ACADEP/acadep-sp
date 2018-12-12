import { Component, OnInit } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { ActivitiesService } from "../../services/activities.service";
import { ProjectsService } from "../../services/projects.service";
import { activity } from '../../models/activity';
import { project } from '../../models/project';
import { isNgTemplate } from '@angular/compiler';

declare var $: any;

@Component({
  selector: 'app-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.css']
})
export class ActivitiesComponent implements OnInit {
  private readonly notifier: NotifierService;

  activities: activity[];
  // activity: activity[];
  activityDoc = {} as activity;

  activityEdit = {} as activity;



  projects: project[];

  tool: string;
  toolEdit: string;




  // activitiesListArray: any[];
  // projectsListArray: any[];

  types = [

    'auditoria',
    'servicio',
    'supervision'

  ];





  constructor(notifierService: NotifierService, public activitiesService: ActivitiesService,
    public projectsService: ProjectsService) {
    this.notifier = notifierService;
    this.activityDoc.type = "";


  }

  ngOnInit() {
    //actividades
    this.activitiesService.getActivities().subscribe(items => {
      this.activities = items;
      console.log(this.activities)
    })

    //proyectos
    this.projectsService.getProjects().subscribe(items => {
      this.projects = items;
      this.activityDoc.tools = [];
    })

  }

  addActivity() {

    this.activitiesService.addActivity(this.activityDoc).then((result) => {
      this.notifier.notify('success', 'Actividad creada!');

    }).catch((err) => {
      this.notifier.notify('error', 'Algo salío mal!');

    });
    console.log(this.activityDoc)

  }

  editActivity(activity)
  {
    this.activityEdit = activity;
   console.log(this.activityEdit.type);
   
    $('#modalEdit').modal('show');
  }


  pushTool() {

    // console.log(this.tool);
    this.activityDoc.tools.push(this.tool);
    this.tool = '';
  }

  pushToolEdit() {
    
    this.activityEdit.tools.push(this.toolEdit);
    console.log(this.activityEdit.tools);
    this.toolEdit = '';
  }

  deleteTool(item) {
    this.activityDoc.tools.splice(item, 1);
  }

  deleteToolEdit(item) 
  {
    this.activityEdit.tools.splice(item, 1);
  }

  updateActivity()
  {
    this.activitiesService.updateActivity(this.activityEdit).then((result) => {
      this.notifier.notify('success', 'Actividad actualizada!');
    }).catch((err) => {
      this.notifier.notify('error', 'Algo salío mal!');
    });
  }

  // onDeleteActivity(item) {
  //   // console.log(item)
  //   this.activitiesService.deleteActivity(item.$key);
  // }

  // getProyect(item) {

  //   this.projectsService.getProyect(item.project_id).then((result: any) => {
  //     return result.name;
  //   }).catch((err) => {
  //     console.log(err)
  //   });
  // }

}
