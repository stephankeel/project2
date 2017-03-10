import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersComponent } from './users/users.component';
import { UserChangeComponent } from './user-change/user-change.component';
import {UserManagementRouterModule} from "./router/usermanagement.router.module";

@NgModule({
  imports: [
    CommonModule,
    UserManagementRouterModule,
  ],
  declarations: [UsersComponent, UserChangeComponent]
})
export class UserManagementModule { }
