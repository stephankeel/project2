import {NgModule}      from '@angular/core';
import {RouterModule, Routes}  from '@angular/router';

import {LoginComponent} from './login/login.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {DevicesSetupComponent} from './devices-setup/devices-setup.component';
import {BlindsSetupComponent} from './devices-setup/blinds-setup/blinds-setup.component';
import {HumiditySetupComponent} from './devices-setup/humidity-setup/humidity-setup.component';
import {TemperatureComponent} from './temperature/temperature.component';
import {TemperatureSetupComponent} from './devices-setup/temperature-setup/temperature-setup.component';
import {UsersComponent} from './users/users.component';
import {AuthGuard} from './auth/auth-guard.service';

const routes: Routes = [
  {path: '', redirectTo: '/login', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'dashboard', canActivate: [AuthGuard], component: DashboardComponent},
  {path: 'temperature', canActivate: [AuthGuard], component: TemperatureComponent},
  {path: 'devices', canActivate: [AuthGuard], component: DevicesSetupComponent},
  {path: 'users', canActivate: [AuthGuard], component: UsersComponent},
  {path: 'setup/blinds', canActivate: [AuthGuard], component: BlindsSetupComponent},
  {path: 'setup/humidity', canActivate: [AuthGuard], component: HumiditySetupComponent},
  {path: 'setup/temperature', canActivate: [AuthGuard], component: TemperatureSetupComponent},
  {path: '**', canActivate: [AuthGuard], component: DashboardComponent},
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {
}
