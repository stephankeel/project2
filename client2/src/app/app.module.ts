import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {HttpModule} from "@angular/http";
import {AppComponent} from "./app.component";
import {MaterialModule} from "@angular/material";
import {AppRouteModule} from "./router/app-route.module";
import {LoginComponent} from "./login/login.component";
import {AuthGuard} from "./auth/auth-guard.service";
import {AuthenticationService} from "./remote/authentication.service";
import {NoAuthGuard} from "./auth/no-auth-guard.service";
import {FooterModule} from "./footer/footer.module";
import {LogoutComponent} from './logout/logout.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    LogoutComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    MaterialModule,
    HttpModule,
    AppRouteModule,
    FooterModule,
  ],
  providers: [
    AuthGuard,
    NoAuthGuard,
    AuthenticationService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
