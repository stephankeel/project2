import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UsersComponent} from './users/users.component';
import {UserChangeComponent} from './user-change/user-change.component';
import {UserManagementRouterModule} from "./router/usermanagement.router.module";
import {MaterialModule} from "@angular/material";
import {AuthHttp, AuthConfig} from "angular2-jwt";
import {RequestOptions, Http} from "@angular/http";
import {ClientSocketService} from "../remote/client-socket.service";
import {UsersService} from "./service/user.service";
import {UserDetailComponent} from './user-detail/user-detail.component';
import {UserDeleteComponent} from './user-delete/user-delete.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ValidatorsModule} from "ng2-validators";


export function authHttpServiceFactory(http: Http, options: RequestOptions) {
  return new AuthHttp(new AuthConfig({
    globalHeaders: [{'Content-Type': 'application/json'}]
  }), http, options);
}

@NgModule({
  imports: [
    CommonModule,
    UserManagementRouterModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    ValidatorsModule,
  ],
  declarations: [
    UsersComponent,
    UserChangeComponent,
    UserDetailComponent,
    UserDeleteComponent,
  ],
  providers: [
    {
      provide: AuthHttp,
      useFactory: authHttpServiceFactory,
      deps: [Http, RequestOptions]
    },
    ClientSocketService,
    UsersService,
  ],
  bootstrap: []

})
export class UserManagementModule {
}
