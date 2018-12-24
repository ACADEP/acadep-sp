import { Component, OnInit } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { ActivitiesService } from "../../services/activities.service";
import { ProjectsService } from "../../services/projects.service";
import { activity } from '../../models/activity';
import { project } from '../../models/project';

import { isNgTemplate } from '@angular/compiler';
import { UsersService } from "../../services/users.service";

import { NgForm } from '@angular/forms/src/directives/ng_form';

// import { isNgTemplate } from '@angular/compiler';

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
  activityCloneDoc = {} as activity;

  activityEdit = {} as activity;



  projects: project[];

  public tool: string;
  public toolEdit: string;
  public name: string;
  public type: string;
  public description: string;
  public tools: string[];
  public project_id: string;
  public users: string[];
  public start: string;
  public end: string;

  persons;




  // activitiesListArray: any[];
  // projectsListArray: any[];

  types = [

    'auditoria',
    'servicio',
    'supervision'

  ];





  constructor(notifierService: NotifierService, public activitiesService: ActivitiesService,
    public projectsService: ProjectsService, public userservice : UsersService) {
    this.notifier = notifierService;
    this.emptyForm()

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

    this.userservice.getUsers().subscribe(items =>{
      this.persons = items;
      // console.log(this.users)
    })

  }


  openActivities()
  {
    alert("en proceso")
  }



  addActivity(form: NgForm) {


    if (form.valid) {

      this.activitiesService.addActivity(this.activityDoc).then((result) => {
        this.removeErrors();
        this.notifier.notify('success', 'Actividad creada!');
        this.emptyForm();

      }).catch((err) => {
        this.notifier.notify('error', 'Algo salío mal!');

      });
    } else {

      if (form.controls.name.invalid) {
        $('#name').addClass('error')
        $('#labelname').addClass('errortxt')

      } else {
        $('#name').removeClass('error')
        $('#labelname').removeClass('errortxt')
      }

      if (form.controls.type.invalid) {
        $('#type').addClass('error')
        $('#labeltype').addClass('errortxt')

      } else {
        $('#type').removeClass('error')
        $('#labeltype').removeClass('errortxt')
      }

      if (form.controls.project.invalid) {
        $('#project').addClass('error')
        $('#labelproject').addClass('errortxt')

      } else {
        $('#project').removeClass('error')
        $('#labelproject').removeClass('errortxt')
      }

      if (form.controls.start.invalid) {
        $('#start').addClass('error')
        $('#labelstart').addClass('errortxt')

      } else {
        $('#start').removeClass('error')
        $('#labelstart').removeClass('errortxt')
      }

      if (form.controls.end.invalid) {
        $('#end').addClass('error')
        $('#labelend').addClass('errortxt')

      } else {
        $('#end').removeClass('error')
        $('#labelend').removeClass('errortxt')
      }


      this.notifier.notify('error', 'Verifica que los campos no esten vacíos');

    }



  }

  editActivity(activity) {
    this.activityEdit = activity;
    console.log(this.activityEdit.type);

    $('#modalEdit').modal('show');
  }

  copyActivity(activity) {
    this.name = activity.name;
    this.type = activity.type;
    this.description = activity.description;
    this.tools = activity.tools;
    this.project_id = activity.project_id;
    this.users = activity.users;
    this.start = activity.start;
    this.end = activity.end;

    this.activityDoc.name = this.name;
    this.activityDoc.type = this.type;
    this.activityDoc.description = this.description;
    this.activityDoc.tools = this.tools;
    this.activityDoc.project_id = this.project_id;
    this.activityDoc.users = this.users;
    this.activityDoc.start = this.start;
    this.activityDoc.end = this.end;

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

  deleteToolEdit(item) {
    this.activityEdit.tools.splice(item, 1);
  }

  updateActivity() {
    this.activitiesService.updateActivity(this.activityEdit).then((result) => {
      $('#modalEdit').modal('hide');
      this.notifier.notify('success', 'Actividad actualizada!');
    }).catch((err) => {
      this.notifier.notify('error', 'Algo salío mal!');
    });
  }

  emptyForm() {
    this.activityDoc.name = '';
    this.activityDoc.type = '';
    this.activityDoc.description = '';
    this.activityDoc.tools = [];
    this.activityDoc.project_id = '';
    this.activityDoc.users = [];
    this.activityDoc.start = '';
    this.activityDoc.end = '';
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

  removeErrors()
  {
    $('input').removeClass('error');
    $('label').removeClass('errortxt');
    $('select').removeClass('error');
  }

}
