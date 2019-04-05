import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../servicios/auth.service';
import { EventsService } from "../../services/events.service";
import { EvidenceService } from "../../services/evidence.service";
import { project } from "../../models/project";
import { ProjectsService } from "../../services/projects.service";
import { Router } from "@angular/router";

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

  projects: project[];

  public notifications = [
    
  ]
  public numNotifications : number;

  constructor(public authService: AuthService, public eventsService:EventsService, 
    public projectsService : ProjectsService,
    public evidenceService : EvidenceService,
    public router : Router) { }

  ngOnInit() {
    this.authService.getAuth().subscribe( auth => {
      this.authUser.email = auth.email;
      this.authUser.name = auth.displayName;
    });

    this.evidenceService.getUnreadEvidence().subscribe(evidence => {
      this.numNotifications = evidence.length;
    })

   this.evidenceService.getNotifications().subscribe(notifications => {
     this.notifications = notifications;
    //  let sound = new Audio;
    //  sound.src = 'assets/sounds/notification.mp3'
    //  sound.play()
   })
   
  // this.projectsService.getProjects().subscribe(projects => {
  //   this.projects = projects;
  //   console.log(this.projects)
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

  // redirect(id:string){
  //   this.router.onSameUrlNavigation;
  //   this.router.navigate(['/evidence/', id]);
  //   console.log(id)
  // }

}
