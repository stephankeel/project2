import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from '../../../auth/auth-guard.service';
import {BlindsComponent} from '../blinds.component';
import {AllBlindsComponent} from '../all-blinds/all-blinds.component';
import {SingleBlindsComponent} from '../single-blinds/single-blinds.component';

const routes: Routes = [{
  path: '', canActivate: [AuthGuard], component: BlindsComponent, children: [
    {path: 'blinds', canActivate: [AuthGuard], component: AllBlindsComponent},
    {path: 'blinds/:id', canActivate: [AuthGuard], component: SingleBlindsComponent},
    {path: '', redirectTo: 'blinds', pathMatch: 'full'},
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

export class BlindsRouterModule {
}
