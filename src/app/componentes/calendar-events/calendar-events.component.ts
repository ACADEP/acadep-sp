import { Component, OnInit, ViewChild } from '@angular/core';
import { CalendarComponent } from 'ng-fullcalendar';
import { Options } from 'fullcalendar';
import { EventsService } from "../../services/events.service";
// import moment = require('moment');
// import moment = require('moment');
// import { reduce } from 'rxjs/operators';
// import { EventManager } from '@angular/platform-browser';
// import { Moment } from 'moment';
// import moment = require('moment');
import * as moment from 'moment';
import { Event } from "../../models/event";

// 

declare var $: any;

@Component({
  selector: 'app-calendar-events',
  templateUrl: './calendar-events.component.html',
  styleUrls: ['./calendar-events.component.css']
})
export class CalendarEventsComponent implements OnInit {
  calendarOptions: Options;
  @ViewChild(CalendarComponent) ucCalendar: CalendarComponent;

  public data = [{
    title: 'New event',
    start: moment(),
    end: moment().add(1, 'day'),
    // allDay : false
  }]

  public events: any[];
  public eventShow:any;
  eventsCollection: Event[];
  constructor(
    public eventsService: EventsService
  ) {

    this.events = [];
    this.eventShow = {
      name: '',
      description: '',
      start: {
        date:'',
        time: ''
      },
      end: {
        date:'',
        time: ''
      },
      activity_id: '',
      user_id: '',
      tools: [],
      staff: []
    }

  }

  ngOnInit() {

    this.eventsService.getEvents().subscribe(async events => {

      this.eventsCollection = events;
      // console.log(this.eventsCollection)
      // await events.forEach(event => {

      //   var color: any;

      //   switch (event.status) {
      //     case 1: 
      //       color = '#333333'
      //       break;
      //     case 2:
      //       color = '#3498db'
      //       break;
      //     case 3:
      //       color = '#9b59b6'
      //       break;
      //     case 4:
      //       color = '#f1c40f'
      //       break;

      //     default:
      //       color = '#ccc'
      //       break;
      //   }

      //   const data = {
      //     title: event.title,
      //     start: event.start,
      //     end: event.end,
      //     color: color,
      //     details: event
      //   }
      //   this.events.push(data);
      // });


      this.calendarOptions = {
        timeFormat: 'hh:mm',
        editable: true,
        eventLimit: true,
        eventStartEditable:true,
        
     
        eventDurationEditable: true,
        // eventDurationEditable: true,
        header: {
          left: 'prev,next today',
          center: 'title',
          right: 'month,agendaWeek,agendaDay,listMonth'
        },
        buttonText: {
            today:    'Hoy',
            month:    'Mes',
            week:     'Semana',
            day:      'Día',
            list:     'Lista',
        },
        // selectable: true,
        events: this.eventsCollection,
        locale: 'es',
       
      };
    })
  }
  clearEvents() {
    this.events = [];
  }

  eventClick(event) {
    console.log(event)
    this.eventShow = event;
    this.eventShow.start = event.start._i;
    this.eventShow.end = event.end._i ;
    $('#details').modal('show');
  }

  clickButton(event){

    event.start = '2019-02-16'
   this.ucCalendar.updateEvent(event)
  }

  resizeEvent($event){

console.log('resize ',$event)
  }
  dropEvent($event){

console.log('drop ',$event)
  }

  updateDates(event){
    
    console.log(this.eventShow)
   this.eventsService.updateEvent(this.eventShow).then((result) => {
    //aqui va alerta de success
     event.start = this.eventShow.start;
     event.end = this.eventShow.end;
    this.ucCalendar.updateEvent(this.eventShow);
    $('#details').modal('hide');
   }).catch((err) => {
     
   });
  }
}
