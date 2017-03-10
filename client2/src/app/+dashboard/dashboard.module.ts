import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {DashboardComponent} from "./dashboard/dashboard.component";
import {DashboardRouterModule} from "./dashboard-router/dashboard-router.module";
import {AuthGuard} from "../auth/auth-guard.service";
import {DeviceOverviewComponent} from "./device-overview/device-overview.component";
import {MaterialModule} from "@angular/material";
import {FooterModule} from "../footer/footer.module";

@NgModule({
  imports: [
    CommonModule,
    DashboardRouterModule,
    MaterialModule,
    FooterModule,
  ],
  declarations: [
    DashboardComponent,
    DeviceOverviewComponent,
  ],
  providers: [
    AuthGuard,
  ],
})
export class DashboardModule {
}
