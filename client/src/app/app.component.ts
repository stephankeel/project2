import {Component} from '@angular/core';
import {Router}   from '@angular/router';

import {AuthenticationService} from './remote/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  private static logInfo: string;

  public static log(info: string): void {
    AppComponent.logInfo = info;
  }

  public static logUser(authenticationService: AuthenticationService) {
    AppComponent.log(`Benutzer: ${authenticationService.getLoggedInUsername()}`);
  }

  getLogInfo(): string {
    return AppComponent.logInfo;
  }

  constructor(private router: Router, private authenticationService: AuthenticationService) {
    AppComponent.log('Starting...');
    if (authenticationService.loggedIn()) {
      AppComponent.logUser(authenticationService);
      this.router.navigate(['/dashboard']);
    } else {
      AppComponent.log('');
      this.router.navigate(['/login']);
    }
  }

}
