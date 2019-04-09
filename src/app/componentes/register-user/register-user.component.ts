import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../servicios/auth.service";
import { UsersService } from "../../services/users.service";
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { User } from "../../models/user";
import { NgForm } from '@angular/forms';
// import { User } from "../../models/user";
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

  usersCollection: User[];
  userDoc = {} as User;
  userDocEdit = {} as User;

  userProjects: [];


  public selectRol: any;

  public userExists: boolean;

  private readonly notifier: NotifierService;

  // public emailEdit : string;
  // public passwordEdit : string;
  // public nameEdit : string;
  // public roleEdit : string;
  // public idEdit : string;


  // public email : string;
  public password: string;
  public password_confirmation: string;
  // public name : string;
  public role: boolean;
  public roleEdit: string;
  public sendRoleEdit: boolean;
  // public uid : string;


  public projects: any;
  constructor(public authService: AuthService,
    public router: Router, notifierService: NotifierService, public userService: UsersService,
  ) {

    this.notifier = notifierService;
    this.emptyForm();
    this.selectRol = "";

    // this.userDoc.role.administrator = false;
    // console.log(this.userDoc.role.administrator)

  }

  ngOnInit() {

    this.userService.getUsers().subscribe(users => {
      this.usersCollection = users;
    })

  }


  // user()

  // id : string, name : string, email:string, rol:string

  onSubmitAddUser(form: NgForm) {

    //validar formulario y dirigir datos
    if (form.valid) {

      this.removeErrors();

      let pass = this.passValidate(this.password, this.password_confirmation);
      if (pass) {

        if (form.value.role == 'employee') { this.role = false; }
        else if (form.value.role == 'administrator') { this.role = true; }

        this.authService.registerUser(this.userDoc.email, this.password)
          .then((res: any) => {
            this.userDoc.id = res.user.uid;

            this.userService.saveUser(this.userDoc, this.role).then( () => {
              this.notifier.notify('success', 'Usuario Guardado!');
              form.reset();
              this.emptyForm();
              // this.authService.getAuth().subscribe( auth => {
                
              //     console.log(auth)
                
              // });
            })
           
          }).catch((err) => {

            switch (err.code) {
              case 'auth/invalid-email':
                $('#email').addClass('error')
                $('#labelemail').addClass('errortxt')
                this.notifier.notify('error', 'El email no está en el formato correcto');
                break;

              default:
                this.notifier.notify('error', 'Algo salio mal.. intentelo mas tarde');
                break;
            }
            console.log(err);
          });
      }
      else {
        this.notifier.notify('error', 'Las contraseñas no coinciden ');
        //añadir clase error a password si no coinciden
        $('#pass').addClass('error')
        $('#labelpass').addClass('errortxt')

        $('#confirm').addClass('error')
        $('#labelconfirm').addClass('errortxt')
      }

    } else {
      this.notifier.notify('error', 'Complete los campos obligatorios');
      this.validateForm(form);
    }


  }

  editUser(user) {
    this.userDocEdit.name = user.name;
    this.userDocEdit.email = user.email;
    this.userDocEdit.role = user.rol;
    this.userDocEdit.id = user.id;

    if (user.role.administrator) {
      this.roleEdit = 'administrator'
    } else {
      this.roleEdit = 'employee'

    }
    // console.log(user)
    $('#modalEdit').modal('show');
  }

  toogleUsers() {

    if ($('#btncolapse').hasClass('fa-plus-circle')) {
      $('#btncolapse').removeClass('fa-plus-circle');
      $('#btncolapse').addClass('fa-minus-circle');
    } else {
      $('#btncolapse').removeClass('fa-minus-circle');
      $('#btncolapse').addClass('fa-plus-circle');
    }
    $('.fa-chevron-down').trigger('click');
  }

  onUpdateuser(e, form: NgForm) {
    e.preventDefault();
    // console.log(form)

    if(form.valid){
      if (this.roleEdit == 'employee') { this.sendRoleEdit = false; }
      else if (this.roleEdit == 'administrator') { this.sendRoleEdit = true; }
  
    //  console.log(this.userDocEdit, this.sendRoleEdit)
  
       this.userService.updateUser(this.userDocEdit, this.sendRoleEdit).then(res => {
         $('#modalEdit').modal('hide');
         this.notifier.notify('success', 'Usuario Actualizado!');
       }).catch(err => {
         this.notifier.notify('error', 'Algo salio mal!');
  
       });
    }
    else{
      this.notifier.notify('error', 'Complete los campos obligatorios');

      if (form.controls.nameedit.invalid) {
        $('#nameedit').addClass('error')
        $('#labelnameedit').addClass('errortxt')
      } else {
        $('#nameedit').removeClass('error')
        $('#labelnameedit').removeClass('errortxt')
      }
      if (form.controls.roledit.invalid) {
        $('#roledit').addClass('error')
        $('#labelroledit').addClass('errortxt')
      } else {
        $('#roledit').removeClass('error')
        $('#labelroledit').removeClass('errortxt')
      }

    }

   


  }

  showAssigns(user) {

    this.userService.getUserProjects(user.id).subscribe(items => {
      this.projects = items;
    })
    console.log(this.projects);
  }

  passValidate(pass1: string, pass2: string): boolean {
    if (pass1 != pass2) {
      return false;
    } else {
      return true;
    }
  }

  objectValues(obj) {
    return Object.values(obj);
  }

  emptyForm() {
    this.userDoc.name = '';
    this.userDoc.email = '';
    this.password = '';
    this.password_confirmation = '';
  }

  validateForm(form: NgForm) {

    // console.log(form)
    if (form.controls.docname.invalid) {
      $('#name').addClass('error')
      $('#labelname').addClass('errortxt')
    } else {
      $('#name').removeClass('error')
      $('#labelname').removeClass('errortxt')
    }
    if (form.controls.email.invalid) {
      $('#email').addClass('error')
      $('#labelemail').addClass('errortxt')
    } else {
      $('#email').removeClass('error')
      $('#labelemail').removeClass('errortxt')
    }
    if (form.controls.role.invalid) {
      $('#role').addClass('error')
      $('#labelrole').addClass('errortxt')
    } else {
      $('#role').removeClass('error')
      $('#labelrole').removeClass('errortxt')
    }
    if (form.controls.pass.invalid) {
      $('#pass').addClass('error')
      $('#labelpass').addClass('errortxt')
    } else {
      $('#pass').removeClass('error')
      $('#labelpass').removeClass('errortxt')
    }
    if (form.controls.confirm.invalid) {
      $('#confirm').addClass('error')
      $('#labelconfirm').addClass('errortxt')
    } else {
      $('#confirm').removeClass('error')
      $('#labelconfirm').removeClass('errortxt')
    }

    // if(form.controls.pass.errors.minlength)
    // {
    //   $('#error_length').css('display', 'block');
    // }else{
    //   $('#error_length').css('display', 'none');

    // }

  }

  removeErrors() {
    $('input').removeClass('error');
    $('label').removeClass('errortxt');
    $('select').removeClass('error');

  }


}
