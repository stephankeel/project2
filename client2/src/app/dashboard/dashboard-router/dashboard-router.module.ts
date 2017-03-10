import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterModule, Routes} from "@angular/router";
import {DashboardComponent} from "../dashboard.component";
import {AuthGuard} from "../../auth/auth-guard.service";
import {DeviceOverviewComponent} from "../device-overview/device-overview.component";

const routes: Routes = [{
  path: '', canActivate: [AuthGuard], component: DashboardComponent, children: [
    {path: 'overview', canActivate: [AuthGuard], component: DeviceOverviewComponent},
    {path: '', redirectTo: 'overview', pathMatch: 'full'},
  ]
}];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule],
  declarations: []
})
export class DashboardRouterModule {
}
