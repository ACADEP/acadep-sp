import { Component, OnInit } from '@angular/core';
import { ProjectsService } from "../../services/projects.service";
import { EventsService } from "../../services/events.service";
import { NotifierService } from 'angular-notifier';
import { ActivitiesService } from "../../services/activities.service";



@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {

  private readonly notifier: NotifierService;

  userListArray: any[];
  eventListArray: any[];
  activitiesListArray: any[];


  public eventName: string;
  public eventStart: string;
  public eventEnd: string;
  public user_uid: string;
  public activity_id: string;


  constructor(public projectsService: ProjectsService, public eventsService: EventsService,
    notifierService: NotifierService, public activitiesService: ActivitiesService) {
    this.notifier = notifierService;
    this.activity_id = "";
    this.user_uid = "";
    this.emptyForm();


  }

  ngOnInit() {

    //actividades
    // this.activitiesService.getActivities().snapshotChanges()
    //   .subscribe(item => {
    //     this.activitiesListArray = [];
    //     item.forEach(element => {
    //       let x = element.payload.toJSON();

    //       if (x['active'] == true) {
    //         x['$key'] = element.key;
    //         this.projectsService.getProyect(x['project_id']).then(function (res: any) {
    //           x['project_name'] = res.name;
    //         })
    //         this.activitiesListArray.push(x);
    //       }

    //     });
    //   })

    //eventos
    this.eventsService.getEvents().snapshotChanges()
      .subscribe(item => {
        this.eventListArray = [];
        item.forEach(element => {
          let x = element.payload.toJSON();
          if (x['active'] == true) {
            x['$key'] = element.key;
            this.activitiesService.getActivity(x['activity_id']).then(function (res: any) {
              x['activity_name'] = res.name;
            })
            this.eventListArray.push(x);
          }
        });
      })

    //usuarios
    // this.projectsService.getUsers().snapshotChanges()
    //   .subscribe(item => {
    //     this.userListArray = [];
    //     item.forEach(element => {
    //       let x = element.payload.toJSON();
    //       x['$key'] = element.key;
    //       this.userListArray.push(x);
    //     });
    //   })

    // console.log(this.userListArray);

  }

  emptyForm()
  {
    this.eventName = "";
    this.eventStart = "";
    this.eventEnd = "";
    this.user_uid = "";
    this.activity_id = "";
  }

  onDateSelect($event) {
    console.log($event);
  }

  addEvent() {
   
    // this.eventName.trim();
  
    if (this.eventName != "" && this.user_uid != "" && this.eventStart != "" && this.eventEnd != "" && this.activity_id != "") {


      this.eventsService.addEvent(this.eventName, this.user_uid, this.eventStart, this.eventEnd, this.activity_id);
      this.notifier.notify('success', 'Evento Agregado!');
      this.emptyForm();
    } else {
      console.log()
      this.notifier.notify('error', 'Faltan datos!');
    }
  }

  deleteEvent(event) {


    this.eventsService.deleteEvent(event.$key).then(() => {
      this.notifier.notify('success', 'Evento eliminado!');

    }).catch((err) => {
      this.notifier.notify('error', 'No se pudo eliminar!');

      console.log(err)
    });

  }

}
