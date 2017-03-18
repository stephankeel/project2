import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DashboardComponent} from './dashboard/dashboard.component';
import {DashboardRouterModule} from './dashboard-router/dashboard-router.module';
import {AuthGuard} from '../auth/auth-guard.service';
import {MaterialModule} from '@angular/material';
import {FooterModule} from '../footer/footer.module';
import {HumidityOverviewComponent} from './humidity-overview/humidity-overview.component';
import {PasswordChangeComponent} from './password-change/password-change.component';
import {FormsModule} from '@angular/forms';
import {ValidatorsModule} from 'ng2-validators';
import {AuthHttp, AuthConfig} from 'angular2-jwt';
import {Http, RequestOptions} from '@angular/http';
import {PasswordChangeConfirmationComponent} from './password-change-confirmation/password-change-confirmation.component';
import {DeviceOverviewModule} from '../device-overview/device-overview.module';
import {ClientSocketService} from '../remote/client-socket.service';
import {BlindsDeviceCacheService} from '../cache/blinds-device.cache.service';
import {TemperatureDeviceCacheService} from '../cache/temperature-device.cache.service';
import {HumidityDeviceCacheService} from '../cache/humidity-device.cache.service';

export function authHttpServiceFactory(http: Http, options: RequestOptions) {
  return new AuthHttp(new AuthConfig({
    globalHeaders: [{'Content-Type': 'application/json'}]
  }), http, options);
}

@NgModule({
  imports: [
    CommonModule,
    DashboardRouterModule,
    MaterialModule,
    FooterModule,
    FormsModule,
    ValidatorsModule,
    DeviceOverviewModule,
  ],
  declarations: [
    DashboardComponent,
    HumidityOverviewComponent,
    PasswordChangeComponent,
    PasswordChangeConfirmationComponent,
  ],
  providers: [
    AuthGuard,
    {
      provide: AuthHttp,
      useFactory: authHttpServiceFactory,
      deps: [Http, RequestOptions]
    },
    ClientSocketService,
    BlindsDeviceCacheService,
    TemperatureDeviceCacheService,
    HumidityDeviceCacheService,
  ],
})
export class DashboardModule {
}
