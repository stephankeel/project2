import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {Routes, RouterModule} from "@angular/router";
import {AuthGuard} from "../../auth/auth-guard.service";
import {UsersComponent} from "../users/users.component";
import {UserChangeComponent} from "../user-change/user-change.component";
import {UserDetailComponent} from "../user-detail/user-detail.component";
import {UserDeleteComponent} from "../user-delete/user-delete.component";

const routes: Routes = [
  {path: '', redirectTo: 'users', pathMatch: 'full'},
  {path: 'users', canActivate: [AuthGuard], component: UsersComponent},
  {path: 'users/edit/:id', canActivate: [AuthGuard], component: UserChangeComponent},
  {path: 'users/detail/:id', canActivate: [AuthGuard], component: UserDetailComponent},
  {path: 'users/delete/:id', canActivate: [AuthGuard], component: UserDeleteComponent},
  {path: 'users/create', canActivate: [AuthGuard], component: UserChangeComponent}];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule],
  declarations: []
})
export class UserManagementRouterModule {
}
