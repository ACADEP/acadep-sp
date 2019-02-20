import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../servicios/auth.service';
import { EventsService } from "../../services/events.service";
declare var $: any;
@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.css']
})
export class TopbarComponent implements OnInit {

  public authUser = {
    name : '',
    email : ''
  }

  public notifications : any;
  public numNotifications : number;

  constructor(public authService: AuthService, public eventsService:EventsService) { }

  ngOnInit() {
    this.authService.getAuth().subscribe( auth => {
      this.authUser.email = auth.email;
      this.authUser.name = auth.displayName;
    });

    // this.eventsService.getEventsUndefined().subscribe( events => {
     
    //   this.numNotifications = events.length;
    // })
    // this.eventsService.getEventsUndefined2().subscribe( events => {
    //   this.notifications = events;
    //   this.numNotifications = events.length;
    // })
  }

  onClickLogout(){
    this.authService.logout()
    .then((res) => {
      console.log('desconectado')

    }).catch((err) =>{
      console.log('error');
    });
  }

  navCollapse(){
    // $('#navcol').addClass('app-side-mini');


    var $nav = $('#navcol');

    if ($nav.hasClass('app-side-mini')) {
        $nav.removeClass('app-side-mini');
    } else {
      $nav.addClass('app-side-mini');
    }
  }

  navCollapsemini(){

    var $nav = $('#navcol');

    if ($nav.hasClass('app-side-opened')) {
        $nav.removeClass('app-side-opened');
        $nav.addClass('app-side-closed');
    } else {
      $nav.removeClass('app-side-closed');
      $nav.addClass('app-side-opened');
    }
  }

}
