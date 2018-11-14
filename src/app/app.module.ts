import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './componentes/dashboard/dashboard.component';
import { AsideComponent } from './componentes/aside/aside.component';
import { TopbarComponent } from './componentes/topbar/topbar.component';

import { FormsModule }   from '@angular/forms';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import {environment} from '../environments/environment';

import { AuthService } from './servicios/auth.service';
import { RegisterUserComponent } from './componentes/register-user/register-user.component';







@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    AsideComponent,
    TopbarComponent,
    RegisterUserComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    AngularFireModule.initializeApp(environment.firebase)    

  ],
  providers: [AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
