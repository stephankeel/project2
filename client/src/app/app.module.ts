import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {FormsModule} from "@angular/forms";
// used to create fake backend
import {HttpModule, BaseRequestOptions, RequestOptions, Http} from "@angular/http";
import {AppComponent} from "./app.component";
import {AppRoutingModule} from "./app-routing.module";
import {LoginComponent} from "./login/login.component";
import {AuthenticationService} from "./remote/authentication.service";
import {ClientSocketService} from "./remote/client-socket.service";
import {DashboardComponent} from "./dashboard/dashboard.component";
import {TemperatureComponent} from "./temperature/temperature.component";
import {UsersComponent} from "./users/users.component";
import {AuthGuard} from "./auth/auth-guard.service";
import {AuthHttp, AuthConfig} from "angular2-jwt";
import {TemperatureViewComponent} from "./temperature-view/temperature-view.component";
import {DevicesSetupComponent} from "./+devices-setup/devices-setup.component";


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
    TemperatureComponent,
    TemperatureViewComponent,
    DevicesSetupComponent,
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
    AuthenticationService,
    ClientSocketService,
    // providers used to create fake backend_helpers/index
    BaseRequestOptions,
  ],
  bootstrap: [
    AppComponent,
  ]
})

export class AppModule {
}

