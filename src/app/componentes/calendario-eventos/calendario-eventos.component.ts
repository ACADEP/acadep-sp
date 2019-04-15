import { Component, OnInit, ViewChild } from '@angular/core';
import { ProjectsService } from "../../services/projects.service";
import { ActivitiesService } from "../../services/activities.service";
import { EventsService } from "../../services/events.service";
import { CalendarEventsComponent } from "../calendar-events/calendar-events.component";
import { EventsComponent } from "../events/events.component";
// import moment = require('moment');

import * as moment from 'moment';



@Component({
  selector: 'app-calendario-eventos',
  templateUrl: './calendario-eventos.component.html',
  styleUrls: ['./calendario-eventos.component.css']
})
export class CalendarioEventosComponent implements OnInit {
  @ViewChild(CalendarEventsComponent) calendar: CalendarEventsComponent;
  @ViewChild(EventsComponent) events: EventsComponent;

  public projectsCollection: any[] = [];
  public activitiesCollection: any = [];
  public eventsCollection: any = [];
  public project_selected = "";
  public activity_selected = "";



  constructor(
    public projectsService : ProjectsService,
    public activitiesService : ActivitiesService,
    public eventsService: EventsService,
    

  ) { }

  ngOnInit() {
    let calendar_project = localStorage.getItem('calendar_project');
    let calendar_activity = localStorage.getItem('calendar_activity');

    this.projectsService.getProjects().subscribe(projects => {
      this.projectsCollection = projects;
    })

     if(calendar_project){
      this.initProjectSelect(calendar_project);
      this.project_selected = calendar_project;  
    }

    if (calendar_activity) {
      this.loadingEvents(calendar_activity);
      this.activity_selected = calendar_activity;
    }
  }

  changeProject(project_id) {
    if (project_id) {
      localStorage.setItem('calendar_project', project_id);
      localStorage.removeItem('calendar_activity');
      // this.ucCalendar.renderEvents([])

      this.activitiesService.getActivitiesByProject(project_id).subscribe(activities => {
        this.activitiesCollection = activities;
      })
    }
    else {
      this.activitiesCollection = [];
      this.calendar.renderEvents([]);
    }
  }

  loadingEvents(activity_id) {
    // console.log(event)
    if (activity_id) {
      
      localStorage.setItem('calendar_activity', activity_id); 
      this.events.eventDoc.activity_id = activity_id;
      this.eventsService.getEventsByActivity(activity_id).subscribe((events:any) => {
        debugger;

        this.eventsCollection = this.formatEvents(events);
        this.calendar.renderEvents(events);
      })
    }
    else {
      this.calendar.renderEvents([]);
    }
  }

  initProjectSelect(project_id) {
    if (project_id) {
      this.activitiesService.getActivitiesByProject(project_id).subscribe(activities => {
        this.activitiesCollection = activities;
      })
    }
    else {
      this.activitiesCollection = []
    }
  }

  formatEvents(events : []) : []{
    const now = new Date();

    function unreleased(fecha):boolean{
      let event_date = new Date((fecha).slice(0, 10));
      if (now > event_date) {
        return true;
      } else {
        return false;
      }
    }

   
    
  
    events.map( (event:any) => {
      
      if (unreleased(event.end) && event.color == '#bdc3c7' ) {
        event.color = '#c0392b';
      }
      else if(unreleased(event.start) && event.color == '#bdc3c7'){
        event.color = '#f1c40f';
      }

    })
    return events;
  }

}
