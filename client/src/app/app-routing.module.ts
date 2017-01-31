import {NgModule}      from '@angular/core';
import {RouterModule, Routes}  from '@angular/router';

import {LoginComponent} from './login/login.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {TemperatureComponent} from './temperature/temperature.component';
import {TemperatureConfigComponent} from './temperature-config/temperature-config.component';
import {DevicesComponent} from './devices/devices.component';
import {UsersComponent} from './users/users.component';
import {AuthGuard} from './auth/auth-guard.service';

const routes: Routes = [
  {path: '', redirectTo: '/login', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'dashboard', canActivate: [AuthGuard], component: DashboardComponent},
  {path: 'devices', canActivate: [AuthGuard], component: DevicesComponent},
  {path: 'users', canActivate: [AuthGuard], component: UsersComponent},
  {path: 'temperature', canActivate: [AuthGuard], component: TemperatureComponent},
  {path: 'config/temperature', canActivate: [AuthGuard], component: TemperatureConfigComponent},
  {path: '**', canActivate: [AuthGuard], component: DashboardComponent},
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {
}
