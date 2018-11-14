import { Component, OnInit } from '@angular/core';
import { AuthService } from '../servicios/auth.service';
import { AngularFireDatabase, AngularFireList, snapshotChanges } from '@angular/fire/database';

import { Router } from '@angular/router';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public email: string;
  public password: string;
  constructor(
    public authService: AuthService, public router: Router, public firebase: AngularFireDatabase
  ) { }

  ngOnInit() {
  }

  onSubmitLogin() {
    this.authService.login(this.email, this.password)
      .then((res) => {

        console.log(res);
        this.router.navigate(['/dashboard'])

      }).catch((err) => {
        console.log(err);
        alert('Datos incorrectos');
      });
  }



}
