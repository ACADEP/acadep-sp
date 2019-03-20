import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ActivitiesComponent } from "./componentes/activities/activities.component";
import { AsideComponent } from "./componentes/aside/aside.component";
// import { CalendarComponent } from "./componentes/calendar/calendar.component";
import { RegisterUserComponent } from "./componentes/register-user/register-user.component";
import { InicioComponent } from "./componentes/inicio/inicio.component";
import { CreateProyectComponent } from "./componentes/proyectos/create-proyect/create-proyect.component";
import { EventsComponent } from "./componentes/events/events.component";
import { GmapComponent } from "./componentes/gmap/gmap.component";
import { CalendarEventsComponent } from "./componentes/calendar-events/calendar-events.component";
import { EvidenceComponent } from "./componentes/evidence/evidence.component";
import { ConfigurationComponent } from "./componentes/configuration/configuration.component";
import { CalendarioEventosComponent } from "./componentes/calendario-eventos/calendario-eventos.component";

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'evidence'},
  { path: 'evidence', component: EvidenceComponent  },
  { path: 'evidence/:id', component: EvidenceComponent  },
  { path: 'calendar', component:  CalendarioEventosComponent },
  { path: 'configuration', component:  ConfigurationComponent },
  { path: 'map', component:  GmapComponent },
  { path: 'users', component:  RegisterUserComponent },
  // { path: 'events', component:  EventsComponent },
  { path: 'activities', component:  ActivitiesComponent },
  { path: 'projects', component:  CreateProyectComponent },
  // { path: 'calendar', component:  InicioComponent },
  // { path: 'aside', component:  AsideComponent },
  { path: '**', pathMatch: 'full', redirectTo: 'evidence'}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { 


}
