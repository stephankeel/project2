import {NgModule}      from '@angular/core';
import {RouterModule, Routes}  from '@angular/router';

import {LoginComponent} from './login/login.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {BlindsComponent} from './blinds/blinds.component';
import {TemperatureComponent} from './temperature/temperature.component';
import {UsersComponent} from './users/users.component';
import {AuthGuard} from './auth/auth-guard.service';
import {AdminOrStandardGuard} from './auth/admin-or-standard-guard.service';
import {DeviceSetupModule} from "./+devices-setup";
import {InfoComponent} from './info/info.component';

const routes: Routes = [
  {path: '', redirectTo: '/login', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'dashboard', canActivate: [AuthGuard], component: DashboardComponent},
  {path: 'blinds', canActivate: [AuthGuard, AdminOrStandardGuard], component: BlindsComponent},
  {path: 'temperature', canActivate: [AuthGuard], component: TemperatureComponent},
  {path: 'users', canActivate: [AuthGuard], component: UsersComponent},
  {path: 'info', canActivate: [AuthGuard], component: InfoComponent},
  {path: 'devices-setup', loadChildren: 'app/+devices-setup/devices-setup.module#DeviceSetupModule'},
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
