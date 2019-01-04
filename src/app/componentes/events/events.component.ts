import { Component, OnInit, Inject } from '@angular/core';
import { NgForm } from '@angular/forms';
import { EventsService } from "../../services/events.service";
import { NotifierService } from 'angular-notifier';
import { ActivitiesService } from "../../services/activities.service";
import { Event } from "../../models/event";
import { activity } from "../../models/activity";
import { UsersService } from "../../services/users.service";
import { User } from "../../models/user";
import { tool } from "../../models/tool";
import { datetime } from "../../models/dateTime"
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';


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

  tool = {} as tool;
  toolEdit = {} as tool;

  person = {} as tool;
  personEdit = {} as tool;
  EventSee: { observation: { before: { evidence: any[]; }; during: { evidence: any[]; }; after: { evidence: any[]; }; }; };




  constructor(public users: UsersService, public eventsService: EventsService,
    notifierService: NotifierService, public activitiesService: ActivitiesService
    , public dialog: MatDialog) {
    this.notifier = notifierService;
    this.eventDoc.start = {} as datetime;
    this.eventDoc.end = {} as datetime;
    this.eventDocEdit.start = {} as datetime;
    this.eventDocEdit.end = {} as datetime;
    this.emptyForm();
    this.eventSeeNull();
  }

  ngOnInit() {
    this.eventsService.getEvents().subscribe(events => {
      this.eventsCollection = events;
      // console.log(this.eventsCollection);
    })

    // usuarios
    this.users.getUsers().subscribe(users => {
      this.usersCollection = users;
      console.log(this.usersCollection)
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
    this.eventDoc.activity_id = '';
    this.eventDoc.user_id = '';
    this.eventDoc.tools = [];
    this.eventDoc.staff = [];
    this.eventDoc.type = '';

    this.tool.name = '';
    this.tool.quantity = null;
  }

  eventSeeNull(): void {
    this.EventSee = {
      observation: {
        before: {
          evidence: []
        },
        during: {
          evidence: []
        },
        after: {
          evidence: []
        }
      }
    }
  }

  toogleEvents() {
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
    // console.log(this.eventDoc)
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

      if (form.controls.startdate.invalid || form.controls.starttime.invalid) {
        $('#starttime').addClass('error')
        $('#startdate').addClass('error')
        $('#labelstart').addClass('errortxt')
      } else {
        $('#startdate').removeClass('error')
        $('#starttime').removeClass('error')
        $('#labelstart').removeClass('errortxt')
      }
      if (form.controls.enddate.invalid) {
        $('#enddate').addClass('error')
        $('#labelend').addClass('errortxt')
      } else {
        $('#enddate').removeClass('error')
        $('#labelend').removeClass('errortxt')
      }
      if (form.controls.endtime.invalid) {
        $('#endtime').addClass('error')
        $('#labelend').addClass('errortxt')
      } else {
        $('#endtime').removeClass('error')
        if (form.controls.enddate.valid) {
          $('#labelend').removeClass('errortxt')
        }
      }

      if (form.controls.startdate.invalid) {
        $('#startdate').addClass('error')
        $('#labelstart').addClass('errortxt')
      } else {
        $('#startdate').removeClass('error')
        $('#labelstart').removeClass('errortxt')
      }
      if (form.controls.starttime.invalid) {
        $('#starttime').addClass('error')
        $('#labelstart').addClass('errortxt')
      } else {
        $('#starttime').removeClass('error')
        if (form.controls.startdate.valid) {
          $('#labelstart').removeClass('errortxt')
        }
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

  updateEvent(form: NgForm) {
    console.log(this.eventDocEdit)
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
    if (form.valid) {
      const tool: tool = {
        name: form.controls.toolname.value,
        quantity: form.controls.toolquant.value
      }
      this.eventDoc.tools.push(tool);
      this.tool.name = '';
      this.tool.quantity = null;
      $('#toolquant').focus();

    } else {
      this.notifier.notify('error', 'Los campos de herramienta no se pueden enviar vacíos');
    }
  }

  pushToolEdit(form: NgForm) {
    console.log(form)
    if (form.valid) {
      const tool: tool = {
        name: form.controls.toolname.value,
        quantity: form.controls.toolquant.value
      }
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
      }
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
      }
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


  removeErrors() {
    $('input').removeClass('error');
    $('label').removeClass('errortxt');
    $('select').removeClass('error');
  }

  seeEvent(event) {
    
      this.EventSee = event;
      $('#seeevent').modal('show');

  
  }

}
