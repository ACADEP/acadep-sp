import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../servicios/auth.service";
import { Router } from '@angular/router';



@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.css']
})
export class RegisterUserComponent implements OnInit {
  
public email : string;
public password : string;
public name : string;
public role : string;
public uid : string;
  constructor( public authService:AuthService, public router: Router) { }

  ngOnInit() {
  }

  onSubmitAddUser() {
    this.authService.registerUser(this.email, this.password)
      .then((res : any) => {

        this.uid = res.user.uid;
        this.authService.saveUser(this.uid, this.name, this.email, this.role)
        console.log('done');
       
      }).catch((err) => {
        console.log(err);
      });
  }

}
