import {NgModule}      from '@angular/core';
import {RouterModule, Routes}  from '@angular/router';

import {LoginComponent} from './login.component';
import {DashboardComponent} from './dashboard.component';
import {UsersComponent} from './users.component';

const routes: Routes = [
    {path: '', redirectTo: '/login', pathMatch: 'full'},
    {path: 'login', component: LoginComponent},
    {path: 'dashboard', component: DashboardComponent},
    {path: 'users', component: UsersComponent},
]

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule {

}
