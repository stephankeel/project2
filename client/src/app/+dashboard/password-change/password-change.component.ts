import {Component, OnInit} from "@angular/core";
import {Router, ActivatedRoute} from "@angular/router";
import {GenericRestService} from "../../remote/generic-rest.service";
import {IUser} from "../../../../../server/entities/user.interface";
import {AuthHttp} from "angular2-jwt";
import {AuthenticationService} from "../../remote/authentication.service";

@Component({
  selector: 'app-password-change',
  templateUrl: 'password-change.component.html',
  styleUrls: ['password-change.component.scss'],
})
export class PasswordChangeComponent implements OnInit {
  message: string;
  currentPassword: string;
  password: string;
  confirmPassword: string;
  private restService: GenericRestService<IUser>;

  constructor(private authenticationService: AuthenticationService,
              private router: Router,
              private http: AuthHttp,
              private route: ActivatedRoute) {
  }

  changePassword(data: any): void {
    this.authenticationService.loginCheckonly(this.authenticationService.getLoggedInUsername(), data.currentPassword)
      .subscribe(result => {
        if (result === true) {
          this.updatePassword(data.password);
        } else {
          this.message = 'Ungültige Anwort vom Server. Interner Server-Fehler.';
        }
      }, error => {
        this.message = `Aktuelles Passwort nicht korrekt (${error})`;
      });
  }

  private updatePassword(password: string) {
    this.restService.get(this.authenticationService.getLoggedInUserId()).subscribe(
      user => {
        user.password = password;
        this.restService.update(user).subscribe(user => {
          this.router.navigate(['../password-confirmation'], {relativeTo: this.route});
        }, error => {
          this.message = `Fehler beim Passwot ändern (${error})`;
        });
      },
      error => {
        this.message = `Fehler beim Passwort ändern (${error})`
      });
  }

  ngOnInit() {
    this.restService = new GenericRestService<IUser>(this.http, "/api/users");
  }

}
