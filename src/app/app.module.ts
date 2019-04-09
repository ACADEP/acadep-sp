import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './componentes/dashboard/dashboard.component';
import { AsideComponent } from './componentes/aside/aside.component';
import { TopbarComponent } from './componentes/topbar/topbar.component';

import { FormsModule } from '@angular/forms';
//firebase
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireStorageModule } from '@angular/fire/storage';

import { FullCalendarModule } from 'ng-fullcalendar';
import { AuthService } from './servicios/auth.service';
import { RegisterUserComponent } from './componentes/register-user/register-user.component';
import { NotifierModule, NotifierOptions } from 'angular-notifier';
import { CalendarComponent } from './componentes/calendar/calendar.component';
import { InicioComponent } from './componentes/inicio/inicio.component';
import { CreateProyectComponent } from './componentes/proyectos/create-proyect/create-proyect.component';
import { EventsComponent } from './componentes/events/events.component';
// import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { ActivitiesComponent } from './componentes/activities/activities.component';
import { CalendarEventsComponent } from "./componentes/calendar-events/calendar-events.component";

//gmaps
import { AgmCoreModule } from "@agm/core";
import { GmapComponent } from './componentes/gmap/gmap.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatAutocompleteModule,
  MatBadgeModule,
  MatBottomSheetModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatDialogModule,
  MatExpansionModule,
  MatTabsModule,
  MatToolbarModule,
  MatInputModule,
  MatIconModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDividerModule,
  MatGridListModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatSortModule,
  MatStepperModule,
  MatTableModule,
  MatTooltipModule,
  MatTreeModule,
} from "@angular/material";


//faltpickr
import { FlatpickrModule } from 'angularx-flatpickr';

import { HttpClientModule } from '@angular/common/http';
import { EvidenceComponent } from './componentes/evidence/evidence.component';

import { GalleryModule } from '@ngx-gallery/core';
import { LightboxModule } from '@ngx-gallery/lightbox';
import { ConfigurationComponent } from './componentes/configuration/configuration.component';
import { ScrollableDirective } from './directives/scrollable.directive';
import { CalendarioEventosComponent } from './componentes/calendario-eventos/calendario-eventos.component';


import { RouterModule } from "@angular/router";



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
    ActivitiesComponent,
    GmapComponent,
    CalendarEventsComponent,
    EvidenceComponent,
    ConfigurationComponent,
    ScrollableDirective,
    CalendarioEventosComponent

  ],
  imports: [
    RouterModule.forRoot(
      [],
      {
      
        onSameUrlNavigation: "reload",
      }
  ),
    GalleryModule,
    BrowserAnimationsModule,
    LightboxModule,
    FlatpickrModule.forRoot(
      {
        // locale: 'Es'
      }
    ),
    MatChipsModule,
    MatDatepickerModule,
    MatDividerModule,
    MatGridListModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatStepperModule,
    MatTableModule,
    MatTooltipModule,
    MatTreeModule,
    MatAutocompleteModule,
    MatBadgeModule,
    MatBottomSheetModule,
    MatButtonModule,
    MatButtonToggleModule,
    BrowserModule,
    MatExpansionModule,
    HttpClientModule,
    MatTabsModule,
    FullCalendarModule,
    MatToolbarModule,
    MatIconModule,
    MatCheckboxModule,
    MatCardModule,
    MatInputModule,
    AppRoutingModule,
    FormsModule,
    MatDialogModule,
    AngularFireStorageModule,
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    AngularFireModule.initializeApp(
      {
    
        apiKey: "AIzaSyD_REBaJDJBe1JMJsFwGJfYi5eIDAHuKnM",
        authDomain: "encuel.firebaseapp.com",
        databaseURL: "https://encuel.firebaseio.com",
        projectId: "encuel",
        storageBucket: "encuel.appspot.com",
        messagingSenderId: "271717891804"
      }
    ),
    AngularFirestoreModule,
    NotifierModule.withConfig(customNotifierOptions),
    // NgbModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBmWGfkOq71k0RF2z2bYFNHdKO-l1zsM5s'
    }),
    // NoopAnimationsModule

  ],
  entryComponents: [
  ],
  providers: [AuthService,],
  bootstrap: [AppComponent]
})
export class AppModule { }
