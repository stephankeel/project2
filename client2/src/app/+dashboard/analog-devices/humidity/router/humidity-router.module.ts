import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from '../../../../auth/auth-guard.service';
import {HumidityComponent} from '../humidity.component';
import {AllHumiditiesComponent} from '../all-humidities/all-humidities.component';
import {SingleHumidityComponent} from '../single-humidity/single-humidity.component';

const routes: Routes = [{
  path: '', canActivate: [AuthGuard], component: HumidityComponent, children: [
    {path: 'humidity', canActivate: [AuthGuard], component: AllHumiditiesComponent},
    {path: 'humidity/:id', canActivate: [AuthGuard], component: SingleHumidityComponent},
    {path: '', redirectTo: 'humidity', pathMatch: 'full'},
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

export class HumidityRouterModule { }
