import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {HttpModule} from "@angular/http";
import {AppComponent} from "./app.component";
import {MaterialModule} from "@angular/material";
import {AppRouteModule} from "./router/app-route-module";
import {DashboardComponent} from "./dashboard/dashboard.component";

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    MaterialModule,
    HttpModule,
    AppRouteModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
