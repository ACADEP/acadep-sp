import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../servicios/auth.service';
declare var $: any;
@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.css']
})
export class TopbarComponent implements OnInit {

  constructor(public authService: AuthService) { }

  ngOnInit() {
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

}
