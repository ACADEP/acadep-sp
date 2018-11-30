import { Component, OnInit } from '@angular/core';
import { ProjectsService } from "../../services/projects.service";
import { EventsService } from "../../services/events.service";
import { NotifierService } from 'angular-notifier';


@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {
 
  private readonly notifier: NotifierService;

  userListArray: any[];
  eventListArray: any[];

  public eventName : string;
  public eventStart : string;
  public eventEnd : string;
  public user_uid : string;

  constructor( public projectsService : ProjectsService, public eventsService: EventsService, notifierService: NotifierService) {
    this.notifier = notifierService;
  

   }

  ngOnInit() {

    this.eventsService.getEvents().snapshotChanges()
      .subscribe(item => {
        this.eventListArray = [];
        item.forEach(element => {
          let x = element.payload.toJSON();
          x['$key'] = element.key;
          if (x['active'] == true) {
            this.eventListArray.push(x);
          }
        });
      })

    this.projectsService.getUsers().snapshotChanges()
    .subscribe(item => {
      this.userListArray = [];
      item.forEach(element => {
        let x = element.payload.toJSON();
        x['$key'] = element.key;
        this.userListArray.push(x);
      });
    })

    // console.log(this.userListArray);

  }

  onDateSelect($event){
    console.log($event);
  }

  addEvent()
  {
    this.eventsService.addEvent(this.eventName, this.user_uid, this.eventStart, this.eventEnd);

  }

  deleteEvent(event){


    this.eventsService.deleteEvent(event.$key).then(() => {
      this.notifier.notify( 'success', 'Evento eliminado!' );

    }).catch((err) => {
      this.notifier.notify( 'error', 'No se pudo eliminar!' );

      console.log(err)
    });
    
  }

}
