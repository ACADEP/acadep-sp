import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../servicios/auth.service";
import { UsersService } from "../../services/users.service";
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { User } from "../../models/user";
// import { ModalService } from "../../services/modal.service";
// import { AngularFirestore } from  'firebase/firestore';

// import { Observable } from "rxjs";

// import { map } from "rxjs/operators";

// import 'rxjs/add/operator/map';

// interface user {

// }

declare var $: any;


@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.css']
})
export class RegisterUserComponent implements OnInit {

users = [];

public roles = [
  'administrador',
  'empleado'
];

public userExists : boolean;

private readonly notifier: NotifierService;

public emailEdit : string;
public passwordEdit : string;
public nameEdit : string;
public roleEdit : string;


public email : string;
public password : string;
public name : string;
public role : string;
public uid : string;
  constructor( public authService:AuthService, public router: Router, notifierService: NotifierService, public userService : UsersService,
   ) {

    this.notifier = notifierService;
    this.role = "";
    this.userService.getUsers().subscribe(users =>{
      this.users = users;
    })
   }

  ngOnInit() {
    
   

  }


  // user()

  // id : string, name : string, email:string, rol:string

  onSubmitAddUser() {
   

    this.authService.registerUser(this.email, this.password)
    .then((res : any) => {

      this.uid = res.user.uid;
      // this.name = 'holi';
      // this.authService.saveUser(this.uid, this.name, this.email, this.role)
      this.userService.saveUser(this.uid, this.name, this.email, this.role);
      this.notifier.notify( 'success', 'Usuario Guardado!' );
      this.email = '';
      this.uid = '';
      this.name = '';
      this.role = '';
      this.password = '';
    }).catch((err) => {
      this.notifier.notify( 'error', 'No se pudo guardar usuario!' );
      console.log(err);
    });


  }

  editUser(user)
  {
   this.nameEdit = user.name;
    $('#modalEdit').modal('show');
  }

  // onUpdateuser()
  // {
  //   console.log(this.userEdit)
  // }

}
