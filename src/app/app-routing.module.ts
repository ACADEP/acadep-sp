import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ActivitiesComponent } from "./componentes/activities/activities.component";
import { AsideComponent } from "./componentes/aside/aside.component";
import { CalendarComponent } from "./componentes/calendar/calendar.component";
import { RegisterUserComponent } from "./componentes/register-user/register-user.component";
import { InicioComponent } from "./componentes/inicio/inicio.component";
import { CreateProyectComponent } from "./componentes/proyectos/create-proyect/create-proyect.component";
import { EventsComponent } from "./componentes/events/events.component";
import { GmapComponent } from "./componentes/gmap/gmap.component";

const routes: Routes = [
  { path: '', component:  InicioComponent },
  { path: 'map', component:  GmapComponent },
  { path: 'users', component:  RegisterUserComponent },
  { path: 'events', component:  EventsComponent },
  { path: 'activities', component:  ActivitiesComponent },
  { path: 'projects', component:  CreateProyectComponent },
  { path: 'calendar', component:  CalendarComponent },
  { path: 'aside', component:  AsideComponent },
  { path: '**', pathMatch: 'full', redirectTo: ''}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { 


}
