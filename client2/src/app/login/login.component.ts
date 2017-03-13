import {Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {AuthenticationService} from "../remote/authentication.service";
import {AuthGuard} from "../auth/auth-guard.service";
import {NotificationService} from '../notification/notification.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['login.component.scss']
})
export class LoginComponent implements OnInit {

  username: string;
  password: string;
  message: string;
  loggedOut: boolean = true;

  constructor(private authenticationService: AuthenticationService,
              private authGuard: AuthGuard,
              private router: Router,
              private notificationService: NotificationService) {
  }

  ngOnInit() {
    this.authenticationService.logout();
//    AppComponent.log('Logged-out');
  }

  doLogin(): void {
    this.clearMessage();
    this.authenticationService.login(this.username, this.password)
      .subscribe(result => {
        if (result === true) {
//          AppComponent.logUser( this.authenticationService);
          let url = this.authGuard.redirectUrl ? this.authGuard.redirectUrl : '/dashboard';
          this.router.navigate([url]);
        } else {
          this.notificationService.error('Benutzername oder Passwort ist nicht korrekt');
          this.message = 'Benutzername oder Passwort ist nicht korrekt.';
        }
      }, error => {
        this.notificationService.error(error.toString());
        this.message = <any>error;
      });
  }

  clearMessage(): void {
    this.notificationService.clear();
    this.message = null;
  }
}
