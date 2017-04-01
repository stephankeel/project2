import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {GenericRestService} from '../../remote/generic-rest.service';
import {IUser} from '../../../../../server/entities/user.interface';
import {AuthHttp} from 'angular2-jwt';
import {AuthenticationService} from '../../remote/authentication.service';
import {PasswordChangeRestService} from '../../remote/password-change-rest.service';
import {NotificationService} from '../../notification/notification.service';

@Component({
  selector: 'app-password-change',
  templateUrl: 'password-change.component.html',
  styleUrls: ['password-change.component.scss'],
})
export class PasswordChangeComponent implements OnInit {
  currentPassword: string;
  password: string;
  confirmPassword: string;
  private restService: GenericRestService<IUser>;

  constructor(private authenticationService: AuthenticationService,
              private router: Router,
              private http: AuthHttp,
              private route: ActivatedRoute,
              private passwordChangeRestService: PasswordChangeRestService,
              private notificationService: NotificationService) {
  }

  changePassword(data: any): void {
    this.authenticationService.loginCheckonly(this.authenticationService.getLoggedInUsername(), data.currentPassword)
      .subscribe(result => {
        if (result === true) {
          this.updatePassword(data.password);
        } else {
          this.notificationService.info('Ungültige Anwort vom Server. Interner Server-Fehler.');
        }
      }, error => {
        this.notificationService.info(`Aktuelles Passwort nicht korrekt (${error})`);
      });
  }

  private updatePassword(password: string) {
    this.passwordChangeRestService.update(password).subscribe(user => {
      this.router.navigate(['../password-confirmation'], {relativeTo: this.route});
    }, error => {
      this.notificationService.info(`Fehler beim Passwot ändern`);
    });
  }

  ngOnInit() {
    this.restService = new GenericRestService<IUser>(this.http, '/api/users');
  }
}
