import {NgModule} from '@angular/core';
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
import {BlindsCommandService} from './remote/blinds-command.service';
import {BlindsComponent} from './blinds/blinds.component';
import {TemperatureComponent} from './temperature/temperature.component';
import {TemperatureViewComponent} from './temperature-view/temperature-view.component';
import {BlindsDataObservablePipe} from './blinds/pipes/blinds-data-observable.pipe';
import {BlindsDataFormatterPipe} from './blinds/pipes/blinds-data-formatter.pipe';
import {BlindsPercentageDownPipe} from './blinds/pipes/blinds-percentage-down.pipe';
import {InfoComponent} from './info/info.component';
import {CommonRestService} from './remote/common-rest.service';
import {BlindsButtonsComponent} from './blinds/blinds-buttons/blinds-buttons.component';
import {MovingBlindsComponent} from './blinds/moving-blinds/moving-blinds.component';
import {SingleBlindsComponent} from './blinds/single-blinds/single-blinds.component';
import {AllBlindsComponent} from './blinds/all-blinds/all-blinds.component';


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
  ],
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    UsersComponent,
    LoginComponent,
    BlindsComponent,
    AllBlindsComponent,
    SingleBlindsComponent,
    BlindsButtonsComponent,
    MovingBlindsComponent,
    TemperatureComponent,
    TemperatureViewComponent,
    BlindsDataObservablePipe,
    BlindsDataFormatterPipe,
    BlindsPercentageDownPipe,
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
    AdminOrStandardGuard,
    AuthenticationService,
    ClientSocketService,
    BlindsCommandService,
    CommonRestService
  ],
  bootstrap: [
    AppComponent,
  ]
})

export class AppModule {
}

