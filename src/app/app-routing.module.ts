import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from "./login/login.component";
import { AsideComponent } from "./componentes/aside/aside.component";
import { CalendarComponent } from "./componentes/calendar/calendar.component";
import { RegisterUserComponent } from "./componentes/register-user/register-user.component";
import { InicioComponent } from "./componentes/inicio/inicio.component";
import { CreateProyectComponent } from "./componentes/proyectos/create-proyect/create-proyect.component"
const routes: Routes = [
  { path: '', component:  InicioComponent },
  { path: 'registeruser', component:  RegisterUserComponent },
  // { path: 'login', component:  LoginComponent },
  { path: 'createproject', component:  CreateProyectComponent },
  { path: 'calendar', component:  CalendarComponent },
  { path: 'aside', component:  AsideComponent },
  // { path: '**', pathMatch: 'full', redirectTo: 'home'}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { 


}
