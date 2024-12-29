import { Routes } from '@angular/router';
import {NotFoundComponent} from '../components/not-found/not-found.component';
import {HomeComponent} from '../components/home/home.component';
import {LoginComponent} from '../components/login/login.component';
import {LogoutComponent} from '../components/logout/logout.component';

export const routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'login', component: LoginComponent},
  {path: 'logout', component: LogoutComponent},
  {path: '', redirectTo:'home', pathMatch: 'full'},
  {path: '**', component: NotFoundComponent}
  ];
