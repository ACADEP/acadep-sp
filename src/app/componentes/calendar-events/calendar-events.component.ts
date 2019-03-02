import { Component, OnInit, ViewChild } from '@angular/core';
import { CalendarComponent } from 'ng-fullcalendar';
import { Options } from 'fullcalendar';
import { EventsService } from "../../services/events.service";
import * as moment from 'moment';
import { Event } from "../../models/event";
import { ActivitiesService } from "../../services/activities.service";
import { ProjectsService } from "../../services/projects.service";
import { UsersService } from "../../services/users.service";
import { User } from 'src/app/models/user';

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

  // public data = [{
  //   title: 'New event',
  //   start: moment(),
  //   end: moment().add(1, 'day'),
  // }]

  public events: any[];
  public eventShow:any;
  // eventsCollection: Event[];
  subprojects: any[]= [];
  acts : any[] = [];
  projectsCollection : any[] = [];
  users: User[];
  constructor(
    public eventsService: EventsService,
    public projectsService : ProjectsService,
    public activitiesService : ActivitiesService,
    public userService : UsersService
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

    this.userService.getUsers().subscribe( users => {
      this.users = users;
    })

    this.projectsService.getProjects().subscribe(projects => {
    this.projectsCollection = projects;
    })


    this.calendarOptions = {
      droppable : false,
      editable: false,
      eventLimit: false,
      eventDurationEditable: true,
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
      events: [],
      locale: 'es',
    };

    // this.eventsService.getEvents().subscribe(async events => {
    //   this.eventsCollection = events;
    // })
  }

  changeProject(project) {
    if (project.target.value) {
      this.ucCalendar.renderEvents([])

      this.activitiesService.getActivitiesByProject(project.target.value).subscribe(activities => {
        this.acts = activities;
      })
    }
    else {
      this.acts = []
    }
  }


  // changeActivity(event) {
  //   if (event.target.value) {
  //     this.activitiesService.getActivitiesBySub(event.target.value).subscribe(activities => {
  //       this.acts = activities;
  //     })
  //   }
  //   else {
  //     this.acts = []
  //   }
  // }

  loadingEvents(event){
    console.log(event)

    if (event.target.value) {
     this.eventsService.getEventsByActivity(event.target.value).subscribe( events => {
      this.events = events;

      this.ucCalendar.renderEvents(this.events)

     })
    }
    else { 
      this.ucCalendar.renderEvents([])
    }
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

  

  resizeEvent($event){

console.log('resize ',$event)
  }
  dropEvent($event){

console.log('drop ',$event)
  }

  updateDates(event){
    
    console.log(this.eventShow)
    this.eventsService.updateEvent(this.eventShow).then((result) => {
    // aqui va alerta de success
      event.start = this.eventShow.start;
      event.end = this.eventShow.end;
     this.ucCalendar.updateEvent(this.eventShow);
     $('#details').modal('hide');
    }).catch((err) => {
     
    });
  }
}
