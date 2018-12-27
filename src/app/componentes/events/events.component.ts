import { Component, OnInit, ɵConsole } from '@angular/core';
import { NgForm } from '@angular/forms';
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
    // 'servicio',
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
  person = {} as tool;




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
    this.eventDoc.start.date = '';
    this.eventDoc.start.time = '';
    this.eventDoc.end.date = '';
    this.eventDoc.end.time = '';
    this.eventDoc.activity_id = '';
    this.eventDoc.user_id = '';
    this.eventDoc.tools = [];
    this.eventDoc.personal = [];
    this.eventDoc.type = '';

    this.tool.name ='';
    this.tool.quantity = null;
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
    console.log(form)
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
      if (form.controls.type.invalid) {
        $('#type').addClass('error')
        $('#labeltype').addClass('errortxt')
      } else {
        $('#type').removeClass('error')
        $('#labeltype').removeClass('errortxt')
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

  objectValues(obj) {
    return Object.values(obj);
  }

  

  pushTool(form: NgForm) {

// console.log(form)
if (form.valid) {
  const tool : tool = {
    name: form.controls.toolname.value,
    quantity : form.controls.toolquant.value
  }
  this.eventDoc.tools.push(tool);
  this.tool.name = '';
  this.tool.quantity = null;
  console.log(this.eventDoc)

} else {
  this.notifier.notify('error', 'Los campos de herramienta no se pueden enviar vacíos');

}
   
  }


  pushPersonal(form: NgForm) {
console.log(form)
if (form.valid) {
  const person : tool = {
    name: form.controls.personname.value,
    quantity : form.controls.personquant.value
  }

  // console.log(person);
  this.eventDoc.personal.push(person);
  this.person.name = '';
  this.person.quantity = null;
  console.log(this.eventDoc)
} else {
  this.notifier.notify('error', 'Los campos de personal no se pueden enviar vacíos');
}
   
  }

  deleteTool(item) {
    this.eventDoc.tools.splice(item, 1);
  }
  deletePersonal(item) {
    this.eventDoc.personal.splice(item, 1);
  }


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
