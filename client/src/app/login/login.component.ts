import { Component, OnInit } from "@angular/core";
import {Router} from "@angular/router";

import {AuthenticationService} from "../remote/authentication.service";

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

  constructor(private authenticationService: AuthenticationService,
              private router: Router) {
    this.loggedOut = !authenticationService.loggedIn();
  }

  ngOnInit() {
    this.authenticationService.logout();
  }

  doLogin(): void {
    this.loggedOut = false;
    this.authenticationService.login(this.username, this.password)
      .subscribe(result => {
        if (result === true) {
          let url = this.authenticationService.redirectUrl ? this.authenticationService.redirectUrl : '/dashboard';
          this.router.navigate([url]);
        } else {
          this.message = 'Username or password is incorrect';
          this.loggedOut = true;
        }
      });
  }

  doLogout(): void {
    this.authenticationService.logout();
    this.loggedOut = true;
  }

  clearMessage(): void {
    this.message = null;
  }
}
