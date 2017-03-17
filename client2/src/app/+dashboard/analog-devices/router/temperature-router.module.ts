import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from '../../../auth/auth-guard.service';
import {TemperatureComponent} from "../temperature/temperature.component";

const routes: Routes = [{
  path: '', canActivate: [AuthGuard], component: TemperatureComponent, children: [
    {path: 'temperature', canActivate: [AuthGuard], component: TemperatureComponent},
    {path: 'temperature/:id', canActivate: [AuthGuard], component: TemperatureComponent},
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
