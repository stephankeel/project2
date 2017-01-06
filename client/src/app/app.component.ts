import {Component} from '@angular/core';
import {Router}   from '@angular/router';

import {AuthenticationService} from './remote/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  private logInfo: string;

  log(info: string): void {
    this.logInfo = info;
  }

  constructor(private router: Router, private authenticationService: AuthenticationService) {
    this.log('Starting...');
    if (authenticationService.loggedIn()) {
      this.log('Goto dashboard');
      this.router.navigate(['/dashboard']);
    } else {
      this.log('Goto login');
      this.router.navigate(['/login']);
    }
  }

}
