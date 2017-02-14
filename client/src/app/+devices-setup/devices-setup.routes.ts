import {ModuleWithProviders} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {AuthGuard} from "../auth/auth-guard.service";
import {BlindsSetupComponent} from "./blinds-setup";
import {HumiditySetupComponent} from "./humidity-setup";
import {TemperatureSetupComponent} from "./temperature-setup";
import {DevicesSetupComponent} from ".";

const deviceSetupRoutes: Routes = [
  {path: '', canActivate: [AuthGuard], component: DevicesSetupComponent},
  {path: 'blinds-setup', canActivate: [AuthGuard], component: BlindsSetupComponent},
  {path: 'humidity-setup', canActivate: [AuthGuard], component: HumiditySetupComponent},
  {path: 'temperature-setup', canActivate: [AuthGuard], component: TemperatureSetupComponent},
];

export const deviceSetupRouting: ModuleWithProviders = RouterModule.forChild(deviceSetupRoutes);
