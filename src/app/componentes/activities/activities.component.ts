import { Component, OnInit } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { ActivitiesService } from "../../services/activities.service";
import { ProjectsService } from "../../services/projects.service";
import { activity } from '../../models/activity';
import { project } from '../../models/project';

import { isNgTemplate } from '@angular/compiler';
import { UsersService } from "../../services/users.service";

import { NgForm } from '@angular/forms/src/directives/ng_form';
import { tool } from 'src/app/models/tool';
import { isNullOrUndefined } from 'util';
// import { datetime } from 'src/app/models/dateTime';

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

  activityAsign = {} as activity;



  projects: project[];

  public insumo: tool = {} as tool;
  public insumoEdit: tool = {} as tool;


  public name: string;
  public type: string;
  public description: string;
  public insumos: tool[] = [];
  public project_id: string;
  public administrators: string[];
  public subproject: any;
  public start: string;
  public end: string;


  persons;

  // public subprojects: string[] = [];
  // activitiesListArray: any[];
  // projectsListArray: any[];

  types = [
    'auditoria',
    'servicio',
    'supervision'
  ];
  // select: string;

  loadingLine : boolean = false;


  constructor(notifierService: NotifierService, public activitiesService: ActivitiesService,
    public projectsService: ProjectsService, public userservice: UsersService) {
    this.notifier = notifierService;
    this.activityDoc.insumos = [];
    this.activityDoc.project_id = "";
    this.emptyForm()
  }

  ngOnInit() {
    let storage = localStorage.getItem('project_id');

    if (storage) {
      this.changeProject(storage);
      this.activityDoc.project_id = storage;
    }


    //proyectos
    this.projectsService.getProjects().subscribe(projects => {
      this.projects = projects;
    })

    this.userservice.getUsers().subscribe(items => {
      this.persons = items;
    })

  }

  onDeleteActivity() {
    console.log('en proceso')
  }

  openAsign(activity) {

    this.activityAsign = activity;
    $('#asign').modal('show');
  }

  toDoAsign(form: NgForm) {

    if (form.valid) {
      this.loadingLine = true;
      $('#error_asign').hide();
          if (confirm("Está seguro que desea asignar todos los eventos de " + this.activityAsign.title + "?")) {
              this.activitiesService.asignActivity(this.activityAsign.id, form.value.user_asign).then( res => {
                this.notifier.notify('success', 'Asignación correcta!')
                $('#asign').modal('hide');
                setTimeout(() => {
                  this.loadingLine = false;
                }, 200);
              }) 
          }
    }
    else {
      $('#error_asign').show();
    }
  }

  addActivity(form: NgForm) {
    if (form.valid) {
      this.activitiesService.addActivity(this.activityDoc).then((result) => {
        this.removeErrors();
        this.notifier.notify('success', 'Actividad creada!');
        this.emptyForm();

      }).catch((err) => {
        this.notifier.notify('error', 'Verifique su conexión a internet');

      });
    } else {

      if (form.controls.name.invalid) {
        $('#name').addClass('error')
        $('#labelname').addClass('errortxt')

      } else {
        $('#name').removeClass('error')
        $('#labelname').removeClass('errortxt')
      }

      // if (form.controls.type.invalid) {
      //   $('#type').addClass('error')
      //   $('#labeltype').addClass('errortxt')

      // } else {
      //   $('#type').removeClass('error')
      //   $('#labeltype').removeClass('errortxt')
      // }

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
        $('#start').css('border', 'red 1px solid')
        $('#labelstart').removeClass('errortxt')
      }

      if (form.controls.end.invalid) {
        $('#end').addClass('error')
        $('#labelend').addClass('errortxt')
      } else {
        $('#end').removeClass('error')
        $('#labelend').removeClass('errortxt')
      }

      if (this.activityDoc.administrators.length < 1) {
        $('#admin').addClass('error')
        $('#labeladmin').addClass('errortxt')

      } else {
        $('#admin').removeClass('error')
        $('#labeladmin').removeClass('errortxt')
      }

      this.notifier.notify('error', 'Verifica que los campos no esten vacíos');

      console.log(form);
    }



  }

  editActivity(activity) {
    this.activityEdit = activity;
    console.log(this.activityEdit);

    $('#modalEdit').modal('show');
  }

  copyActivity(activity) {

    this.name = activity.title;
    this.type = activity.type;
    this.description = activity.description;
    this.insumos = activity.insumos;
    this.project_id = activity.project_id;
    this.subproject = activity.subproject;
    this.administrators = activity.administrators;
    this.start = activity.start;
    this.end = activity.end;

    this.activityDoc.title = this.name;
    // this.activityDoc.type = this.type;
    this.activityDoc.description = this.description;
    this.activityDoc.insumos = this.insumos;
    this.activityDoc.project_id = this.project_id;
    this.activityDoc.administrators = this.administrators;
    this.activityDoc.start = this.start;
    this.activityDoc.end = this.end;

    console.log(activity)

  }


  changeProject(project_id) {

    if (project_id) {
      // this.activityDoc.project_id = project.target.value;
      this.activitiesService.getActivitiesByProject(project_id).subscribe(activities => {
        this.activities = activities;

        localStorage.setItem('project_id', project_id);
      })
    }
    else {
      // this.activityDoc.project_id = '';
      this.activities = []
    }
  }

  pushInsumo(form: NgForm) {
    if (form.valid) {
      const insumo: tool = {
        name: form.controls.insumoname.value,
        quantity: form.controls.insumoquant.value
      }
      this.activityDoc.insumos.push(insumo);
      this.insumo.name = '';
      this.insumo.quantity = null;
      $('#insumoquant').focus();

    } else {
      this.notifier.notify('error', 'Los campos de insumo no se pueden enviar vacíos');
    }
  }



  deleteInsumo(item) {
    this.activityDoc.insumos.splice(item, 1);
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
    this.activityDoc.title = '';
    this.activityDoc.subproject = '';
    this.activityDoc.description = '';
    this.activityDoc.insumos = [];
    this.activityDoc.project_id = '';
    this.activityDoc.administrators = [];
    this.activityDoc.start = new Date().toJSON();
    this.activityDoc.end = new Date().toJSON();
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

  removeErrors() {
    $('input').removeClass('error');
    $('label').removeClass('errortxt');
    $('select').removeClass('error');
  }

  toogleActivities() {

    if ($('#btncolapse').hasClass('fa-plus-circle')) {
      $('#btncolapse').removeClass('fa-plus-circle');
      $('#btncolapse').addClass('fa-minus-circle');
    } else {
      $('#btncolapse').removeClass('fa-minus-circle');
      $('#btncolapse').addClass('fa-plus-circle');

    }

    $('.fa-chevron-down').trigger('click');

  }

  // selectProject(project) {
  //   if (project.target.value) {

  //     this.projectsService.getProject(project.target.value).then((project: any) => {
  //       console.log(project)
  //       this.subprojects = project.subprojects;
  //     }).catch((err) => (console.log(err)));

  //   }
  //   else {
  //     this.subprojects = []
  //   }
  // }

  // changeActivity(event) {
  //   if (event.target.value) {
  //     this.activitiesService.getActivitiesBySub(event.target.value).subscribe(activities => {
  //       this.activities = activities;
  //     })
  //   }
  //   else {
  //     this.activities = []
  //   }
  // }

}
