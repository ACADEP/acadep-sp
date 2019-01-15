import { Component, OnInit, ViewChild } from '@angular/core';
import { CalendarComponent } from 'ng-fullcalendar';
import { Options } from 'fullcalendar';
import { EventsService } from "../../services/events.service";
import { reduce } from 'rxjs/operators';
import { EventManager } from '@angular/platform-browser';

declare var $: any;

@Component({
  selector: 'app-calendar-events',
  templateUrl: './calendar-events.component.html',
  styleUrls: ['./calendar-events.component.css']
})
export class CalendarEventsComponent implements OnInit {
  calendarOptions: Options;
  @ViewChild(CalendarComponent) ucCalendar: CalendarComponent;

  public data = {
    title: 'New event',
    start: '2019-01-07',
    end: '2019-01-10'
  }

  public events: any[];
  public eventShow:any;
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

      await events.forEach(event => {

        var color: any;

        switch (event.status) {
          case 1:
            color = '#1abc9c'
            break;
          case 2:
            color = '#3498db'
            break;
          case 3:
            color = '#9b59b6'
            break;
          case 4:
            color = '#f1c40f'
            break;

          default:
            color = '#ccc'
            break;
        }

        const data = {
          title: event.title,
          start: event.start,
          end: event.end,
          color: color,
          details: event
        }
        this.events.push(data);
      });




      this.calendarOptions = {
        editable: true,
        eventLimit: false,
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
        selectable: true,
        events: this.events,
        locale: 'es',
       
      };
      // console.log(this.events);
    })

// console.log(this.events)

  }
  clearEvents() {
    this.events = [];
  }

  eventClick(info) {
    console.log(this.events)
    this.eventShow = info.event.details;
   
    $('#details').modal('show');
  }

  clickButton(event){
    console.log(event) //nothing
  }

  updateEvent($event){
console.log($event)
  }
}
