import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from '../../../auth/auth-guard.service';
import {TemperatureComponent} from "../temperature/temperature.component";
import {AllTemperaturesComponent} from '../temperature/all-temperatures/all-temperatures.component';

const routes: Routes = [{
  path: '', canActivate: [AuthGuard], component: TemperatureComponent, children: [
    {path: 'temperature', canActivate: [AuthGuard], component: AllTemperaturesComponent},
    {path: 'temperature/:id', canActivate: [AuthGuard], component: AllTemperaturesComponent},
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

export class TemperatureRouterModule { }
