import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms/src/directives/ng_form';
import { EventsService } from "../../services/events.service";
import { NotifierService } from 'angular-notifier';
import { ActivitiesService } from "../../services/activities.service";
import { Event } from "../../models/event";
import { activity } from "../../models/activity";
import { UsersService } from "../../services/users.service";
import { User } from "../../models/user";
import { tool } from "../../models/tool";

declare var $: any;



@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {

  private readonly notifier: NotifierService;


  types = [

    'auditoria',
    'servicio',
    'supervision',
    'revision'

  ];

  eventsCollection: Event[];
  usersCollection: User[];
  activitiesCollection: activity[];
  eventDoc = {} as Event;
  eventDocEdit = {} as Event;
  toolEdit: string;
  tool = {} as tool;




  constructor(public users: UsersService, public eventsService: EventsService,
    notifierService: NotifierService, public activitiesService: ActivitiesService) {
    this.notifier = notifierService;
    this.emptyForm();


  }

  ngOnInit() {


    this.eventsService.getEvents().subscribe(events => {
      this.eventsCollection = events;
      // console.log(this.eventsCollection);
    })

    // usuarios
    this.users.getUsers().subscribe(users => {
      this.usersCollection = users;
      // console.log(this.usersCollection)
    })

    this.activitiesService.getActivities().subscribe(items => {
      this.activitiesCollection = items;
    })


  }

  emptyForm() {
    this.eventDoc.name = '';
    this.eventDoc.user_id = '';
    this.eventDoc.activity_id = '';
    this.eventDoc.description = '';
    this.eventDoc.start = '';
    this.eventDoc.end = '';
    this.eventDoc.activity_id = '';
    this.eventDoc.user_id = '';
    this.eventDoc.tools = [];

    this.tool.name ='';
    this.tool.quantity = 0;
  }

  toogleEvents()
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


  addEvent(form: NgForm) {
    if (form.valid) {
      this.eventsService.addEvent(this.eventDoc).then(res => {
        this.notifier.notify('success', 'Evento creado');
        // console.log(res);
        this.removeErrors();
        this.emptyForm();
      }).catch(err => {
        this.notifier.notify('error', 'Algo salio mal...');
      })
    } else {
      this.notifier.notify('error', 'Completa los campos obligatorios');
      
      if (form.controls.name.invalid) {
        $('#name').addClass('error')
        $('#labelname').addClass('errortxt')
      } else {
        $('#name').removeClass('error')
        $('#labelname').removeClass('errortxt')
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
      if (form.controls.user.invalid) {
        $('#user').addClass('error')
        $('#labeluser').addClass('errortxt')
      } else {
        $('#user').removeClass('error')
        $('#labeluser').removeClass('errortxt')
      }
      if (form.controls.activity.invalid) {
        $('#activity').addClass('error')
        $('#labelactivity').addClass('errortxt')
      } else {
        $('#activity').removeClass('error')
        $('#labelactivity').removeClass('errortxt')
      }
    }
  }

  updateEvent() {
    this.eventsService.updateEvent(this.eventDocEdit).then(res => {
      this.notifier.notify('success', 'Evento actualizdo');
      $('#modalEdit').modal('hide');
    }).catch(err => {
      this.notifier.notify('error', 'Algo salio mal...');
      console.log(err);
    })
  }

  editEvent(event) {
    this.eventDocEdit = event;
    $('#modalEdit').modal('show');

  }

  deleteEvent(event) {


    // this.eventsService.deleteEvent(event.$key).then(() => {
    //   this.notifier.notify('success', 'Evento eliminado!');

    // }).catch((err) => {
    //   this.notifier.notify('error', 'No se pudo eliminar!');

    //   console.log(err)
    // });

  }

  pushTool() {

    console.log(this.tool);
    this.eventDoc.tools.push(this.tool);

  }
  deleteTool(item) {
    this.eventDoc.tools.splice(item, 1);
  }

  // pushToolEdit() {

  //   this.eventDocEdit.tools.push(this.toolEdit);
  //   console.log(this.eventDocEdit.tools);
  //   this.toolEdit = '';
  // }
  deleteToolEdit(item) {
    this.eventDocEdit.tools.splice(item, 1);
  }

  removeErrors()
  {
    $('input').removeClass('error');
    $('label').removeClass('errortxt');
    $('select').removeClass('error');

  }

}
