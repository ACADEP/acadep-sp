import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../servicios/auth.service";
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';




@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.css']
})
export class RegisterUserComponent implements OnInit {

private readonly notifier: NotifierService;
public email : string;
public password : string;
public name : string;
public role : string;
public uid : string;
  constructor( public authService:AuthService, public router: Router, notifierService: NotifierService) {
    this.notifier = notifierService;
    this.role = "";
   }

  ngOnInit() {
  }

  onSubmitAddUser() {
    this.authService.registerUser(this.email, this.password)
      .then((res : any) => {

        this.uid = res.user.uid;
        this.authService.saveUser(this.uid, this.name, this.email, this.role)
        this.notifier.notify( 'success', 'Usuario Guardado!' );

       
      }).catch((err) => {
        this.notifier.notify( 'error', 'No se pudo guardar usuario!' );
        console.log(err);
      });
  }

}
