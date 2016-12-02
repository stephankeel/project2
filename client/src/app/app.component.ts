import { Component } from '@angular/core';
import {Router}   from '@angular/router';

import {GenericService} from './generic.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./common.css', './app.component.css']
})
export class AppComponent {

  logInfo: string;

  log(info: string): void {
    this.logInfo = info;
  }

  //constructor(private router: Router, private loginCompoent: LoginComponent) {}
  constructor(private router: Router, private genericService: GenericService) {
    this.log('Starting...');
    if (genericService.loggedIn()) {
      this.log('Goto dashboard');
      this.router.navigate(['/dashboard']);
    } else {
      this.log('Goto login');
      this.router.navigate(['/login']);
    }
  }
}
