import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { EventsService } from "../../services/events.service";
import { NotifierService } from 'angular-notifier';
import { ActivitiesService } from '../../services/activities.service';
import { Event } from '../../models/event';
import { activity } from '../../models/activity';
import { UsersService } from '../../services/users.service';
import { User } from '../../models/user';
import { tool } from '../../models/tool';
import { total } from "../../models/event";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatAccordion } from '@angular/material';
import { ProjectsService } from "../../services/projects.service";

import { AfireService } from "../../services/afire.service";
import { map } from 'rxjs/operators';
import * as _ from 'lodash';
import { project } from 'src/app/models/project';

declare var $: any;

export interface DialogData {
  animal: string;
  name: string;
}



@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {

  todos: Array<any> = [];
  batch: number = 40;
  last: any = '2018-01-01';
  empty: boolean = false;
  loading: boolean = false;


  @ViewChild('myaccordion') myPanels: MatAccordion;

  private readonly notifier: NotifierService;
  types = [
    'supervision'
  ];

  public subprojects: string[] = [];
  public acts: activity[] = [];
  projSelect = ''
  eventsCollection: Event[];
  usersCollection: User[];
  activitiesCollection: activity[];
  projectsCollection: project[];
  eventDoc = {} as Event;
  eventDocEdit = {} as Event;

  tool = {} as tool;
  toolEdit = {} as tool;

  person = {} as tool;
  personEdit = {} as tool;
  // EventSee: any = { observation: { before: { evidence: [] }, during: { evidence: [] }, after: { evidence: [] } } };




  constructor(public users: UsersService, public eventsService: EventsService,
    notifierService: NotifierService, public activitiesService: ActivitiesService,
    public dialog: MatDialog, public aFireService: AfireService,
    public projectsService: ProjectsService) {

    this.eventDoc.total = {} as total;
    this.notifier = notifierService;
    this.eventDoc.start = new Date().toJSON();
    this.eventDoc.end = new Date().toJSON();

    this.eventDocEdit.start = new Date().toJSON();
    this.eventDocEdit.end = new Date().toJSON();
    this.emptyForm();
  
  }

  ngOnInit() {

    // this.fetchTodosPaginated();

    // this.eventsService.getEvents().subscribe(events => {
    //   this.eventsCollection = events;
    // });

    // usuarios
    this.users.getUsers().subscribe(users => {
      this.usersCollection = users;
    });

    // this.activitiesService.getActivities().subscribe(items => {
    //   this.activitiesCollection = items;
    //   console.log()
    // });

    this.projectsService.getProjects().subscribe(projects => {
      this.projectsCollection = projects;
      // console.log(projects)
    })

  }

  changeProject(project) {
    if (project.target.value) {
      this.eventsCollection = []

      this.activitiesService.getActivitiesByProject(project.target.value).subscribe(activities => {
        this.acts = activities;
      })
    }
    else {
      this.eventsCollection = []
    }
  }



  loadingEvents(event){
    console.log(event)

    if (event.target.value) {
      
     this.eventsService.getEventsByActivity(event.target.value).subscribe( events => {
       this.eventsCollection = events;
     })
    }
    else { this.eventsCollection = [] }
  }

  scrollHandler(e) {

    if (e == 'bottom') {
      this.onScroll()
    }
  }

  onScroll() {
    // console.log('bottom')
    this.loading = true;
    setTimeout(() => {
      this.fetchTodosPaginated();
      this.loading = false;
    }, 1500);
  }

  fetchTodosPaginated() {
    this.aFireService.paginate(this.batch, this.last).pipe(
      map(data => {
        if (!data.length) {
          this.empty = true;
        }
        let last = _.last(data);
        if (last) {
          this.last = last.payload.doc.data().start;
          data.map(todoSnap => {
            // console.log(todoSnap.payload.doc.data())
            this.todos.push(todoSnap.payload.doc.data());
          })
        }
      })
    ).subscribe();
  }

  emptyForm() {
    this.eventDoc.title = '';
    this.eventDoc.user_id = '';
    this.eventDoc.activity_id = '';
    this.eventDoc.description = '';
    this.eventDoc.activity_id = '';
    this.eventDoc.user_id = '';
    this.eventDoc.tools = [];
    this.eventDoc.staff = [];
    this.eventDoc.type = '';

    this.tool.name = '';
    this.tool.quantity = null;

    this.eventDoc.total.number = 0;
    this.eventDoc.total.unit = '';
  }

  openAll() {
    this.myPanels.openAll();
  }

  closeAll() {
    this.myPanels.closeAll();
  }

  addEvent(form: NgForm) {


    if (form.valid && form.controls.number.value >= 0) {
      this.eventsService.addEvent(this.eventDoc).then(res => {
        this.notifier.notify('success', 'Evento creado');
        this.removeErrors();
        this.emptyForm();
      }).catch(err => {
        this.notifier.notify('error', 'Algo salio mal...');
      });
    } else {
      console.log(form);
      this.notifier.notify('error', 'Completa los campos obligatorios');

      if (form.controls.name.invalid) {
        $('#name').addClass('error');
        $('#labelname').addClass('errortxt');
      } else {
        $('#name').removeClass('error');
        $('#labelname').removeClass('errortxt');
      }
      if (form.controls.type.invalid) {
        $('#type').addClass('error');
        $('#labeltype').addClass('errortxt');
      } else {
        $('#type').removeClass('error');
        $('#labeltype').removeClass('errortxt');
      }

      if (form.controls.unit.invalid) {
        $('#unit').addClass('error');
        $('#total').addClass('errortxt');
      } else {
        $('#unit').removeClass('error');
        $('#total').removeClass('errortxt');
      }

      if (form.controls.number.value <= 0) {
        $('#number').addClass('error');
        $('#total').addClass('errortxt');
      } else {
        $('#number').removeClass('error');
        $('#total').removeClass('errortxt');
      }

      if (form.controls.start.invalid) {
        //  $('#startinput').addClass('error');
        $('#start').addClass('errortxt');
      } else {
        //  $('#startinput').removeClass('error');
        $('#start').removeClass('errortxt');
      }
      if (form.controls.end.invalid) {
        //  $('#endinput').addClass('error');
        $('#end').addClass('errortxt');
      } else {
        //  $('#endinput').removeClass('error');
        $('#end').removeClass('errortxt');
      }




      if (form.controls.user.invalid) {
        $('#user').addClass('error');
        $('#labeluser').addClass('errortxt');
      } else {
        $('#user').removeClass('error');
        $('#labeluser').removeClass('errortxt');
      }
      if (form.controls.activity.invalid) {
        $('.activity').addClass('error');
        $('#labelactivity').addClass('errortxt');
      } else {
        $('.activity').removeClass('error');
        $('#labelactivity').removeClass('errortxt');
      }
    }

  }

  updateEvent(form: NgForm) {
    console.log(this.eventDocEdit);
    this.eventsService.updateEvent(this.eventDocEdit).then(res => {
      this.notifier.notify('success', 'Evento actualizdo');
      $('#modalEdit').modal('hide');
    }).catch(err => {
      this.notifier.notify('error', 'Algo salio mal...');
      console.log(err);
    });
  }

  editEvent(event) {
    this.eventDocEdit = event;
    $('#modalEdit').modal('show');
  }

  objectValues(obj) {
    return Object.values(obj);
  }

  pushTool(form: NgForm) {
    if (form.valid) {
      const tool: tool = {
        name: form.controls.toolname.value,
        quantity: form.controls.toolquant.value
      };
      this.eventDoc.tools.push(tool);
      this.tool.name = '';
      this.tool.quantity = null;
      $('#toolquant').focus();

    } else {
      this.notifier.notify('error', 'Los campos de herramienta no se pueden enviar vacíos');
    }
  }

  pushToolEdit(form: NgForm) {
    console.log(form);
    if (form.valid) {
      const tool: tool = {
        name: form.controls.toolname.value,
        quantity: form.controls.toolquant.value
      };
      this.eventDocEdit.tools.push(tool);
      this.toolEdit.name = '';
      this.toolEdit.quantity = null;
      $('#toolquantedit').focus();

    } else {
      this.notifier.notify('error', 'Los campos de herramienta no se pueden enviar vacíos');
    }
  }


  pushPersonal(form: NgForm) {
    if (form.valid) {
      const person: tool = {
        name: form.controls.personname.value,
        quantity: form.controls.personquant.value
      };
      this.eventDoc.staff.push(person);
      this.person.name = '';
      this.person.quantity = null;
      $('#personquant').focus();


    } else {
      this.notifier.notify('error', 'Los campos de personal no se pueden enviar vacíos');
    }
  }

  pushPersonalEdit(form: NgForm) {
    if (form.valid) {
      const person: tool = {
        name: form.controls.personname.value,
        quantity: form.controls.personquant.value
      };
      this.eventDocEdit.staff.push(person);
      this.personEdit.name = '';
      this.personEdit.quantity = null;
      $('#personquantedit').focus();

    } else {
      this.notifier.notify('error', 'Los campos de personal no se pueden enviar vacíos');
    }
  }

  deleteTool(item) {
    this.eventDoc.tools.splice(item, 1);
  }

  deletePersonal(item) {
    this.eventDoc.staff.splice(item, 1);
  }

  deleteToolEdit(item) {
    this.eventDocEdit.tools.splice(item, 1);
  }

  deletePersonalEdit(item) {
    this.eventDocEdit.staff.splice(item, 1);
  }

  deleteEvent(event) {
    if (confirm("Está seguro que desea eliminar " + event.title)) {
      this.eventsService.deleteEvent(event.id).then(() => {
        this.notifier.notify('success', 'Evento eliminado');
      }).catch(() => {
        this.notifier.notify('error', 'Algo salío mal, intente mas tarde');
      })
    }
  }


  removeErrors() {
    $('input').removeClass('error');
    $('label').removeClass('errortxt');
    $('select').removeClass('error');
  }

}
