import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {LoginComponent} from "../login/login.component";
import {NoAuthGuard} from "../auth/no-auth-guard.service";
import {AuthGuard} from "../auth/auth-guard.service";

const routes: Routes = [
  {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
  {path: 'login', canActivate: [NoAuthGuard], component: LoginComponent},
  {path: 'dashboard', canActivate: [AuthGuard], loadChildren: 'app/+dashboard/dashboard.module#DashboardModule'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes),
  ],
  exports: [RouterModule]
})
export class AppRouteModule {
}
