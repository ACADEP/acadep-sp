import { Component } from '@angular/core';
import { AuthService } from './servicios/auth.service';
import * as $ from 'jquery';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public isLogin: boolean;

  constructor(public authService: AuthService) { }

  ngOnInit() {
    this.authService.getAuth().subscribe( auth => {
      if (auth) {
      
        this.authService.getAdmin(auth.uid).then( pass => {
          // console.log(pass)
          if(pass == true)
          {
            this.isLogin = true;
          }
          else{
            this.isLogin = false;
          }

        })

        // this.fotoUsuario = auth.photoURL;
      } else {

        this.isLogin = false;

      }
    });
  }

}
