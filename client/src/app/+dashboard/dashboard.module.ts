import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {DashboardComponent} from "./dashboard/dashboard.component";
import {DashboardRouterModule} from "./dashboard-router/dashboard-router.module";
import {MaterialModule} from "@angular/material";
import {FooterModule} from "../footer/footer.module";
import {PasswordChangeComponent} from "./password-change/password-change.component";
import {FormsModule} from "@angular/forms";
import {ValidatorsModule} from "ng2-validators";
import {AuthConfig, AuthHttp} from "angular2-jwt";
import {Http, RequestOptions} from "@angular/http";
import {PasswordChangeConfirmationComponent} from "./password-change-confirmation/password-change-confirmation.component";
import {DeviceOverviewModule} from "../device-overview/device-overview.module";
import {MyValidatorsModule} from "../my-validators/my-validators.module";
import {InfoComponent} from "./info/info.component";
import {ListSupportModule} from "../list-support/list-support.module";
import {CommonRestService} from "../remote/common-rest.service";
import {PasswordChangeRestService} from "../remote/password-change-rest.service";

@NgModule({
  imports: [
    CommonModule,
    DashboardRouterModule,
    MaterialModule,
    FooterModule,
    FormsModule,
    ValidatorsModule,
    DeviceOverviewModule,
    MyValidatorsModule,
    ListSupportModule,
  ],
  declarations: [
    DashboardComponent,
    PasswordChangeComponent,
    PasswordChangeConfirmationComponent,
    InfoComponent,
  ],
  providers: [
    CommonRestService,
    PasswordChangeRestService,
  ],
})
export class DashboardModule {
}
