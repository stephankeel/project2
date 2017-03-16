import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterModule, Routes} from "@angular/router";
import {AuthGuard} from "../../auth/auth-guard.service";
import {DeviceManagementComponent} from "../device-management/device-management.component";
import {BlindsSetupOverviewComponent} from "../blinds-setup-overview/blinds-setup-overview.component";
import {TemperatureSetupOverviewComponent} from "../temperature-setup-overview/temperature-setup-overview.component";
import {HumiditySetupOverviewComponent} from "../humidity-setup-overview/humidity-setup-overview.component";

const routes: Routes = [
  {path: '', redirectTo: 'overview', pathMatch: 'full'},
  {path: 'overview', canActivate: [AuthGuard], component: DeviceManagementComponent},
  {path: 'temperature-overview', canActivate: [AuthGuard], component: TemperatureSetupOverviewComponent},
  {path: 'blinds-overview',canActivate: [AuthGuard], component: BlindsSetupOverviewComponent},
  {path: 'humidity-overview', canActivate: [AuthGuard], component: HumiditySetupOverviewComponent},
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule],
  declarations: []
})
export class DeviceManagementRouterModule {
}
