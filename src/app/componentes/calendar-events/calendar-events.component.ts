import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
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
  // @ViewChild('calendar_project') calendar_project: ElementRef;

  public events: any[];
  public eventShow: any;
  // eventsCollection: Event[];
  subprojects: any[] = [];
  acts: any[] = [];
  projectsCollection: any[] = [];
  users: User[];


  calendar_project = "";
  calendar_activity = "";

  constructor(
    public eventsService: EventsService,
    public projectsService: ProjectsService,
    public activitiesService: ActivitiesService,
    public userService: UsersService
  ) {

    

    let calendar_project = localStorage.getItem('calendar_project');
    let calendar_activity = localStorage.getItem('calendar_activity');

    // if(calendar_project){
    //   this.initProjectSelect(calendar_project);
    //  this.calendar_project = calendar_project;
    // }
    // if(calendar_project){
    //   this.initProjectSelect(calendar_project);
    //   this.calendar_project = calendar_project;  
    // }

    // if (calendar_activity) {
    //   this.loadingEvents(calendar_activity);
    //   this.calendar_activity = calendar_activity;
      
    // }

    this.events = [];
    this.eventShow = {
      name: '',
      description: '',
      start: {
        date: '',
        time: ''
      },
      end: {
        date: '',
        time: ''
      },
      activity_id: '',
      user_id: '',
      tools: [],
      staff: []
    }
  }

  ngOnInit() {

    // let calendar_event = localStorage.getItem('calendar_event');
    // console.log(storage);

    this.userService.getUsers().subscribe(users => {
      this.users = users;
    })

    this.projectsService.getProjects().subscribe(projects => {
      this.projectsCollection = projects;
    })

    this.eventsService.getEvents().subscribe(async events => {
      this.calendarOptions = {
        droppable: false,
        editable: false,
        eventLimit: true,
        eventDurationEditable: true,
        header: {
          left: 'prev,next today',
          center: 'title',
          right: 'month,agendaWeek,agendaDay,listMonth'
        },
        buttonText: {
          today: 'Hoy',
          month: 'Mes',
          week: 'Semana',
          day: 'Día',
          list: 'Lista',
        },
        events: events,
        locale: 'es',
      };
    })


    

    
  }

  changeProject(project_id) {
    if (project_id) {
      localStorage.setItem('calendar_project', project_id);
      localStorage.removeItem('calendar_activity');
      this.ucCalendar.renderEvents([])

      this.activitiesService.getActivitiesByProject(project_id).subscribe(activities => {
        this.acts = activities;
      })
    }
    else {
      this.acts = []
    }
  }

  initProjectSelect(project_id) {
    if (project_id) {
      this.activitiesService.getActivitiesByProject(project_id).subscribe(activities => {
        this.acts = activities;
      })
    }
    else {
      this.acts = []
    }
  }

  loadingEvents(activity_id) {
    // console.log(event)
    if (activity_id) {
      
      localStorage.setItem('calendar_activity', activity_id); 
      this.eventsService.getEventsByActivity(activity_id).subscribe((events:any) => {
        this.events = events;
        console.log()
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
    this.eventShow.end = event.end._i;
    $('#details').modal('show');
  }

  clickButton($event){
    console.log($event)
  }



  resizeEvent($event) {

    console.log('resize ', $event)
  }
  dropEvent($event) {

    console.log('drop ', $event)
  }

  updateDates(event) {

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
