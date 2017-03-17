import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterModule, Routes} from "@angular/router";
import {DashboardComponent} from "../dashboard/dashboard.component";
import {AuthGuard} from "../../auth/auth-guard.service";
import {DeviceOverviewComponent} from "../../device-overview/device-overview/device-overview.component";
import {HumidityOverviewComponent} from "../humidity-overview/humidity-overview.component";
import {PasswordChangeConfirmationComponent} from "../password-change-confirmation/password-change-confirmation.component";
import {PasswordChangeComponent} from "../password-change/password-change.component";

const routes: Routes = [{
  path: '', canActivate: [AuthGuard], component: DashboardComponent, children: [
    {path: 'overview', canActivate: [AuthGuard], component: DeviceOverviewComponent},
    {
      path: 'blinds-overview',
      canActivate: [AuthGuard],
      loadChildren: 'app/+dashboard/blinds/blinds.module#BlindsModule'
    },
    {path: 'humidity-overview', canActivate: [AuthGuard], component: HumidityOverviewComponent},
    {
      path: 'temperature-overview',
      canActivate: [AuthGuard],
      loadChildren: 'app/+dashboard/analog-devices/temperature/temperature.module#TemperatureModule'
    },
    {path: 'password-change', canActivate: [AuthGuard], component: PasswordChangeComponent},
    {path: 'password-confirmation', canActivate: [AuthGuard], component: PasswordChangeConfirmationComponent},
    {path: '', redirectTo: 'overview', pathMatch: 'full'},
    {
      path: 'user-management',
      canActivate: [AuthGuard],
      loadChildren: 'app/+user-management/user-management.module#UserManagementModule'
    },
    {
      path: 'device-management',
      canActivate: [AuthGuard],
      loadChildren: 'app/+device-management/device-management.module#DeviceManagementModule'
    },
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
