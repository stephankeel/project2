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
import {BlindsdeviceDeleteComponent} from "../blinds-setup-overview/blindsdevice-delete/blindsdevice-delete.component";
import {HumiditydeviceChangeComponent} from "../humidity-setup-overview/humiditydevice-change/humiditydevice-change.component";
import {HumiditydeviceDetailsComponent} from "../humidity-setup-overview/humiditydevice-details/humiditydevice-details.component";
import {HumiditydeviceDeleteComponent} from "../humidity-setup-overview/humiditydevice-delete/humiditydevice-delete.component";
import {TemperaturedeviceDeleteComponent} from "../temperature-setup-overview/temperaturedevice-delete/temperaturedevice-delete.component";
import {TemperaturedeviceChangeComponent} from "../temperature-setup-overview/temperaturedevice-change/temperaturedevice-change.component";
import {TemperaturedeviceDetailsComponent} from "../temperature-setup-overview/temperaturedevice-details/temperaturedevice-details.component";

const routes: Routes = [
  {path: '', redirectTo: 'overview', pathMatch: 'full'},
  {path: 'overview', canActivate: [AuthGuard], component: DeviceManagementComponent},
  {path: 'blinds-overview',canActivate: [AuthGuard], component: BlindsSetupOverviewComponent},
  {path: 'blinds-overview/edit/:id',canActivate: [AuthGuard], component: BlindsdeviceChangeComponent},
  {path: 'blinds-overview/detail/:id',canActivate: [AuthGuard], component: BlindsdeviceDetailsComponent},
  {path: 'blinds-overview/create',canActivate: [AuthGuard], component: BlindsdeviceChangeComponent},
  {path: 'blinds-overview/delete/:id',canActivate: [AuthGuard], component: BlindsdeviceDeleteComponent},
  {path: 'humidity-overview', canActivate: [AuthGuard], component: HumiditySetupOverviewComponent},
  {path: 'humidity-overview/edit/:id',canActivate: [AuthGuard], component: HumiditydeviceChangeComponent},
  {path: 'humidity-overview/detail/:id',canActivate: [AuthGuard], component: HumiditydeviceDetailsComponent},
  {path: 'humidity-overview/create',canActivate: [AuthGuard], component: HumiditydeviceChangeComponent},
  {path: 'humidity-overview/delete/:id',canActivate: [AuthGuard], component: HumiditydeviceDeleteComponent},
  {path: 'temperature-overview', canActivate: [AuthGuard], component: TemperatureSetupOverviewComponent},
  {path: 'temperature-overview/edit/:id',canActivate: [AuthGuard], component: TemperaturedeviceChangeComponent},
  {path: 'temperature-overview/detail/:id',canActivate: [AuthGuard], component: TemperaturedeviceDetailsComponent},
  {path: 'temperature-overview/create',canActivate: [AuthGuard], component: TemperaturedeviceChangeComponent},
  {path: 'temperature-overview/delete/:id',canActivate: [AuthGuard], component: TemperaturedeviceDeleteComponent},
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
