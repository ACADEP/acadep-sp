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
import { AngularFirestore, AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import {environment} from '../environments/environment';

import { AuthService } from './servicios/auth.service';
import { RegisterUserComponent } from './componentes/register-user/register-user.component';
import { NotifierModule, NotifierOptions } from 'angular-notifier';
import { CalendarComponent } from './componentes/calendar/calendar.component';
import { InicioComponent } from './componentes/inicio/inicio.component';
import { CreateProyectComponent } from './componentes/proyectos/create-proyect/create-proyect.component';
import { EventsComponent } from './componentes/events/events.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { ActivitiesComponent } from './componentes/activities/activities.component';



const customNotifierOptions: NotifierOptions = {
  position: {
		horizontal: {
			position: 'right',
			distance: 12
		},
		vertical: {
			position: 'top',
			distance: 200,
			gap: 10
		}
	},
  theme: 'material',
  behaviour: {
    autoHide: 5000,
    onClick: 'hide',
    onMouseover: 'pauseAutoHide',
    showDismissButton: true,
    stacking: 4
  },
  animations: {
    enabled: true,
    show: {
      preset: 'slide',
      speed: 300,
      easing: 'ease'
    },
    hide: {
      preset: 'fade',
      speed: 300,
      easing: 'ease',
      offset: 50
    },
    shift: {
      speed: 300,
      easing: 'ease'
    },
    overlap: 150
  }
};

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    AsideComponent,
    TopbarComponent,
    RegisterUserComponent,
    CalendarComponent,
    InicioComponent,
    CreateProyectComponent,
    EventsComponent,
    ActivitiesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    NotifierModule.withConfig(customNotifierOptions),
    NgbModule,

  ],
  providers: [AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
