import { Component, OnInit } from '@angular/core';
import {Router}    from '@angular/router';

import {GenericService} from '../generic.service';

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

  constructor(private genericService: GenericService,
              private router: Router) {
    this.loggedOut = !genericService.loggedIn();
  }

  ngOnInit() {
  }

  doLogin(): void {
    this.genericService.login(this.username, this.password).then(user => {
      this.message = 'welcome';
      this.loggedOut = false;
      this.router.navigate(['/dashboard']);
    }).catch(error => {
      this.message = 'login failure: ' + (error.message || error);
    });
  }

  doLogout(): void {
    this.genericService.logout();
    this.loggedOut = true;
  }

  clearMessage(): void {
    this.message = null;
  }


}
