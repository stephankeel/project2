import {NgModule}      from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule}   from '@angular/forms';
import {HttpModule}    from '@angular/http';

import {AppComponent}  from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {Angular2JWTModule} from 'angular2-jsonwebtoken';
import {AUTH_PROVIDERS} from 'angular2-jwt';
import {LoginComponent} from './login/login.component';
import {UserService} from "./remote/user.service";
import {AuthenticationService} from './remote/authentication.service';
import {DashboardComponent} from "./dashboard/dashboard.component";
import {UsersComponent} from "./users/users.component";
import {AuthGuard} from "./auth/auth-guard.service";

// used to create fake backend
import {BaseRequestOptions} from '@angular/http';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    Angular2JWTModule
  ],
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    UsersComponent,
    LoginComponent
  ],
  providers: [
    UserService,
    AuthGuard,
    AUTH_PROVIDERS,
    AuthenticationService,
    // providers used to create fake backend_helpers/index
    BaseRequestOptions
  ],
  bootstrap: [AppComponent]
})

export class AppModule {
}

