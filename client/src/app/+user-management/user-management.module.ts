import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UsersComponent} from './users/users.component';
import {UserChangeComponent} from './user-change/user-change.component';
import {UserManagementRouterModule} from './router/usermanagement.router.module';
import {MaterialModule} from '@angular/material';
import {UserDetailComponent} from './user-detail/user-detail.component';
import {UserDeleteComponent} from './user-delete/user-delete.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ValidatorsModule} from 'ng2-validators';
import {ListSupportModule} from '../list-support/list-support.module';
import {UserListFormatterPipe} from './users/user-list-formatter.pipe';


@NgModule({
  imports: [
    CommonModule,
    UserManagementRouterModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    ValidatorsModule,
    ListSupportModule,
  ],
  declarations: [
    UsersComponent,
    UserChangeComponent,
    UserDetailComponent,
    UserDeleteComponent,
    UserListFormatterPipe,
  ],
  providers: [],
  bootstrap: []

})
export class UserManagementModule {
}
