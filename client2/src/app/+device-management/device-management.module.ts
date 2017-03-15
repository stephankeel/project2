import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AuthGuard} from "../auth/auth-guard.service";
import {AuthHttp, AuthConfig} from "angular2-jwt";
import {Http, RequestOptions} from "@angular/http";
import {DeviceOverviewModule} from "../device-overview/device-overview.module";
import { TestComponent } from './test/test.component';
import {DeviceManagementRouterModule} from "./device-management-router/device-management-router.module";
import {DeviceOverviewComponent} from "../device-overview/device-overview/device-overview.component";

export function authHttpServiceFactory(http: Http, options: RequestOptions) {
  return new AuthHttp(new AuthConfig({
    globalHeaders: [{'Content-Type': 'application/json'}]
  }), http, options);
}

@NgModule({
  imports: [
    CommonModule,
    DeviceManagementRouterModule,
    DeviceOverviewModule,
  ],
  declarations: [],
  providers: [
    AuthGuard,
    {
      provide: AuthHttp,
      useFactory: authHttpServiceFactory,
      deps: [Http, RequestOptions]
    },
  ],
})
export class DeviceManagementModule { }
