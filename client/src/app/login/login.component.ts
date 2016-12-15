import { Component, OnInit } from "@angular/core";
import {Router} from "@angular/router";

import {LoginService} from "../remote/login.service";

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

  // TODO: change variable names?
//  loaded = false;
//  model: any = {};
//  error : string = "";

  constructor(private loginService: LoginService,
              private router: Router) {
    this.loggedOut = !loginService.loggedIn();
  }

  ngOnInit() {
    this.loginService.logout();
  }

  doLogin(): void {
    this.loggedOut = false;
    this.loginService.login(this.username, this.password)
      .subscribe(result => {
        if (result === true) {
          this.router.navigate(['/dashboard']);
        } else {
          this.message = 'Username or password is incorrect';
          this.loggedOut = true;
        }
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
