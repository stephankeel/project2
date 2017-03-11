import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from '../../auth/auth-guard.service';
import {AdminOrStandardGuard} from '../../auth/admin-or-standard-guard.service';
import {BlindsComponent} from '../blinds.component';
import {AllBlindsComponent} from '../all-blinds/all-blinds.component';
import {SingleBlindsComponent} from '../single-blinds/single-blinds.component';

const routes: Routes = [{
  path: '', canActivate: [AuthGuard, AdminOrStandardGuard], component: BlindsComponent, children: [
    {path: 'blinds', canActivate: [AuthGuard, AdminOrStandardGuard], component: AllBlindsComponent},
    {path: 'blinds/:id', canActivate: [AuthGuard, AdminOrStandardGuard], component: SingleBlindsComponent},
    {path: '', redirectTo: 'blinds', pathMatch: 'full'},
  ]
}];

@NgModule({
  imports: [
    CommonModule, RouterModule.forChild(routes),
  ],
  exports: [RouterModule],
  providers: [BlindsComponent],
})

export class BlindsRouterModule { }
