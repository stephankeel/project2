import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterModule, Routes} from "@angular/router";
import {AuthGuard} from "../../auth/auth-guard.service";
import {DeviceManagementComponent} from "../device-management/device-management.component";
import {BlindsSetupOverviewComponent} from "../blinds-setup-overview/blinds-setup-overview.component";
import {TemperatureSetupOverviewComponent} from "../temperature-setup-overview/temperature-setup-overview.component";
import {HumiditySetupOverviewComponent} from "../humidity-setup-overview/humidity-setup-overview.component";
import {BlindsdeviceDetailsComponent} from "../blinds-setup-overview/blindsdevice-details/blindsdevice-details.component";
import {BlindsdeviceChangeComponent} from "../blinds-setup-overview/blindsdevice-change/blindsdevice-change.component";

const routes: Routes = [
  {path: '', redirectTo: 'overview', pathMatch: 'full'},
  {path: 'overview', canActivate: [AuthGuard], component: DeviceManagementComponent},
  {path: 'temperature-overview', canActivate: [AuthGuard], component: TemperatureSetupOverviewComponent},
  {path: 'blinds-overview',canActivate: [AuthGuard], component: BlindsSetupOverviewComponent},
  {path: 'blinds-overview/edit/:id',canActivate: [AuthGuard], component: BlindsdeviceChangeComponent},
  {path: 'blinds-overview/detail/:id',canActivate: [AuthGuard], component: BlindsdeviceDetailsComponent},
  {path: 'blinds-overview/create',canActivate: [AuthGuard], component: BlindsdeviceChangeComponent},
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
