import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from '../../../../auth/auth-guard.service';
import {TemperatureComponent} from '../temperature.component';
import {AllTemperaturesComponent} from '../all-temperatures/all-temperatures.component';
import {SingleTemperatureComponent} from '../single-temperature/single-temperature.component';

const routes: Routes = [{
  path: '', canActivate: [AuthGuard], component: TemperatureComponent, children: [
    {path: 'temperature', canActivate: [AuthGuard], component: AllTemperaturesComponent},
    {path: 'temperature/:id', canActivate: [AuthGuard], component: SingleTemperatureComponent},
    {path: '', redirectTo: 'temperature', pathMatch: 'full'},
  ]
}];

@NgModule({
  imports: [
    CommonModule, RouterModule.forChild(routes),
  ],
  exports: [RouterModule],
  providers: [],
  declarations: [],
})

export class TemperatureRouterModule {
}
