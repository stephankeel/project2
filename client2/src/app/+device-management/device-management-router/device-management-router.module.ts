import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterModule, Routes} from "@angular/router";
import {AuthGuard} from "../../auth/auth-guard.service";
import {DeviceManagementComponent} from "../device-management/device-management.component";

const routes: Routes = [
  {path: '', redirectTo: 'overview', pathMatch: 'full'},
  {path: 'overview', canActivate: [AuthGuard], component: DeviceManagementComponent},
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
