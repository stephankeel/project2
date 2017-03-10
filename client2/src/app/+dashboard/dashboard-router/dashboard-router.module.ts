import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterModule, Routes} from "@angular/router";
import {DashboardComponent} from "../dashboard/dashboard.component";
import {AuthGuard} from "../../auth/auth-guard.service";
import {DeviceOverviewComponent} from "../device-overview/device-overview.component";
import {TemperatureOverviewComponent} from "../temperature-overview/temperature-overview.component";
import {BlindsOverviewComponent} from "../blinds-overview/blinds-overview.component";
import {HumidityOverviewComponent} from "../humidity-overview/humidity-overview.component";

const routes: Routes = [{
  path: '', canActivate: [AuthGuard], component: DashboardComponent, children: [
    {path: 'overview', canActivate: [AuthGuard], component: DeviceOverviewComponent},
    {path: 'temperature-overview', canActivate: [AuthGuard], component: TemperatureOverviewComponent},
    {path: 'blinds-overview', canActivate: [AuthGuard], component: BlindsOverviewComponent},
    {path: 'humidity-overview', canActivate: [AuthGuard], component: HumidityOverviewComponent},
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
