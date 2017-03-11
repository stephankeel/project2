import {NgModule, ErrorHandler} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {HttpModule, RequestOptions, Http} from '@angular/http';
import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {AuthenticationService} from './remote/authentication.service';
import {AuthGuard} from './auth/auth-guard.service';
import {AdminOrStandardGuard} from './auth/admin-or-standard-guard.service';
import {AuthHttp, AuthConfig} from 'angular2-jwt';
import {ClientSocketService} from './remote/client-socket.service';
import {LoginComponent} from './login/login.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {UsersComponent} from './users/users.component';
import {TemperatureComponent} from './temperature/temperature.component';
import {TemperatureViewComponent} from './temperature-view/temperature-view.component';
import {InfoComponent} from './info/info.component';
import {CommonRestService} from './remote/common-rest.service';
import {NotificationService} from './notification/notification.service';
import { GrowlModule } from 'primeng/primeng';

// TODO: in welches File müsste diese Methode?
export function authHttpServiceFactory(http: Http, options: RequestOptions) {
  return new AuthHttp(new AuthConfig({
    globalHeaders: [{'Content-Type': 'application/json'}]
  }), http, options);
}

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    GrowlModule,
  ],
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    UsersComponent,
    LoginComponent,
    TemperatureComponent,
    TemperatureViewComponent,
    InfoComponent
  ],
  providers: [
    AuthGuard,
    {
      provide: AuthHttp,
      useFactory: authHttpServiceFactory,
      deps: [Http, RequestOptions]
    },
    {
      provide: Window,
      useValue: window
    },
    NotificationService,
    AdminOrStandardGuard,
    AuthenticationService,
    ClientSocketService,
    CommonRestService
  ],
  bootstrap: [
    AppComponent,
  ]
})

export class AppModule {
}

