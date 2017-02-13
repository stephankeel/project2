import {ModuleWithProviders} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {AuthGuard} from "../auth/auth-guard.service";
import {BlindsSetupComponent} from "./blinds-setup/blinds-setup.component";
import {HumiditySetupComponent} from "./humidity-setup/humidity-setup.component";
import {TemperatureSetupComponent} from "./temperature-setup/temperature-setup.component";

const deviceSetupRoutes: Routes = [
  {path: 'blinds', canActivate: [AuthGuard], component: BlindsSetupComponent},
  {path: 'humidity', canActivate: [AuthGuard], component: HumiditySetupComponent},
  {path: 'temperature', canActivate: [AuthGuard], component: TemperatureSetupComponent},
]

export const deviceSetupRouting: ModuleWithProviders = RouterModule.forChild(deviceSetupRoutes);
