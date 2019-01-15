import { Component, OnInit } from '@angular/core';
import { AuthService } from '../servicios/auth.service';
import { NgForm } from '@angular/forms/src/directives/ng_form';
import { NotifierService } from 'angular-notifier';

import { AngularFireDatabase, AngularFireList, snapshotChanges } from '@angular/fire/database';

import { Router } from '@angular/router';

declare var $:any;


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  private readonly notifier: NotifierService;

  public email: string;
  public password: string;

  public isError = false;
  constructor(
    public authService: AuthService, public router: Router, public firebase: AngularFireDatabase,
    notifierService: NotifierService
  ) {
    this.notifier = notifierService;

   }

  ngOnInit() {
  }

  onSubmitLogin(form : NgForm) {
    // console.log(form);
    if (form.valid) {
      $('#mail').removeClass('error')
      $('#pass').removeClass('error')

      //  console.log(form);
    this.authService.login(this.email, this.password)
      .then((res :any) => {
        
        this.authService.getAdmin(res.user.uid).then( res => {
          if (res == true) {
            // console.log('redirigido')
            this.router.navigate(['/'])
          } else {
            this.notifier.notify('error', 'No tienes permiso para entrar');
            this.authService.logout();
          }
        });       
       
      }).catch((err) => {
        console.log(err);
        switch (err.code) {
          case 'auth/invalid-email':
          this.notifier.notify('error', 'El email no está en el formato correcto');
          $('#mail').addClass('error')

            break;

          case 'auth/user-not-found':
          this.notifier.notify('error', 'Contraseña/Email incorrectos');

            break;

          case 'auth/wrong-password':
          this.notifier.notify('error', 'Contraseña/Email incorrectos');

            break;

          case 'auth/too-many-requests':
          this.notifier.notify('error', 'Demasiados intentos por favor intente mas tarde');

            break;
        
          default:
          this.notifier.notify('error', 'Algo salio mal..');

            break;
        }
        
      });
    } else {

      if (form.controls.mail.invalid) {
        $('#mail').addClass('error')
      }else{
        $('#mail').removeClass('error')
      }
      if (form.controls.pass.invalid) {
        $('#pass').addClass('error')
      }else{
        $('#pass').removeClass('error')
      }
      this.notifier.notify('error', 'Complete todos los campos!');

     
    }
  }

}
