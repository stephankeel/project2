import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {Routes, RouterModule} from "@angular/router";
import {AuthGuard} from "../../auth/auth-guard.service";
import {UsersComponent} from "../users/users.component";
import {UserChangeComponent} from "../user-change/user-change.component";

const routes: Routes = [
  {path: '', redirectTo: 'users'},
  {
    path: 'users', canActivate: [AuthGuard], component: UsersComponent, children: [
    {path: ':id', canActivate: [AuthGuard], component: UserChangeComponent},
  ]
  }];

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
