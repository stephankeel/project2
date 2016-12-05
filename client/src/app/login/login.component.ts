import { Component, OnInit } from '@angular/core';
import {Router}    from '@angular/router';

import {LoginService} from '../remote/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  username: string;
  password: string;
  message: string;
  loggedOut: boolean = true;

  constructor(private loginService: LoginService,
              private router: Router) {
    this.loggedOut = !loginService.loggedIn();
  }

  ngOnInit() {
  }

  doLogin(): void {
    this.loginService.login(this.username, this.password).then(user => {
      this.message = 'welcome';
      this.loggedOut = false;
      let url = this.loginService.redirectUrl ? this.loginService.redirectUrl : '/dashboard';
      this.router.navigate([url]);
    }).catch(error => {
      this.message = 'login failure: ' + (error.message || error);
    });
  }

  doLogout(): void {
    this.loginService.logout();
    this.loggedOut = true;
  }

  clearMessage(): void {
    this.message = null;
  }


}
