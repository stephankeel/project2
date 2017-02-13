import {NgModule}      from '@angular/core';
import {RouterModule, Routes}  from '@angular/router';

import {LoginComponent} from './login/login.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {DevicesSetupComponent} from './+devices-setup/devices-setup.component';
import {TemperatureComponent} from './temperature/temperature.component';
import {UsersComponent} from './users/users.component';
import {AuthGuard} from './auth/auth-guard.service';
import {DeviceSetupModule} from "./+devices-setup";

const routes: Routes = [
  {path: '', redirectTo: '/login', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'dashboard', canActivate: [AuthGuard], component: DashboardComponent},
  {path: 'temperature', canActivate: [AuthGuard], component: TemperatureComponent},
  {path: 'devices', canActivate: [AuthGuard], component: DevicesSetupComponent},
  {path: 'users', canActivate: [AuthGuard], component: UsersComponent},
  {path: 'setup', loadChildren: 'app/+devices-setup/devices-setup.module#DeviceSetupModule'},
  {path: '**', canActivate: [AuthGuard], component: DashboardComponent},
]

@NgModule({
  imports: [RouterModule.forRoot(routes),
    DeviceSetupModule,
  ],
  exports: [RouterModule]
})

export class AppRoutingModule {
}
