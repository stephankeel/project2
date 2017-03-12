import {Component, OnInit} from '@angular/core';
import {UsersService} from "../service/user.service";
import {IUser} from "../../../../../server/entities/user.interface";
import {ActivatedRoute, Router} from "@angular/router";
import {Subscription} from "rxjs";
import {UserTypesArray} from "../../../../../server/entities/user-type";
import {AuthenticationService} from "../../remote/authentication.service";

@Component({
  selector: 'app-user-change',
  templateUrl: 'user-change.component.html',
  styleUrls: ['user-change.component.scss']
})
export class UserChangeComponent implements OnInit {

  private sub: Subscription;
  private user: IUser = {};
  private title: string;
  private userTypes: any[];

  constructor(private userService: UsersService, private route: ActivatedRoute, private router: Router, private authenticationService: AuthenticationService) {
    this.userTypes = UserTypesArray;
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      if (params['id']) {
        this.userService.getDataService().subscribe(dataService => {
          this.user = dataService.getCache(params['id']);
          console.log(`User: ${JSON.stringify(this.user)}`);
          this.title = "Benutzer ändern";
        });
      } else {
        this.title = "Neuer Benutzer anlegen";
      }
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  submit(user: IUser) {
    this.userService.getDataService().subscribe(dataService => {
      if (this.user.id) {
        user.id = this.user.id;
        dataService.getRestService().update(user).subscribe(user => {
          console.log(`user updated: ${JSON.stringify(user)}`);
          this.router.navigate(['../../'], {relativeTo: this.route});
        }, error => {
          console.log(`Error: user updated ${JSON.stringify(error)}`);
        });
      } else {
        dataService.getRestService().add(user).subscribe(user => {
          console.log(`user created: ${JSON.stringify(user)}`);
          this.router.navigate(['../../'], {relativeTo: this.route});
        }, error => {
          console.log(`Error: user created ${JSON.stringify(error)}`);
        });
      }
    });
  }

  cancel() {
    this.router.navigate(['../../'], {relativeTo: this.route});
  }

  isLoggedInUser(user: IUser) {
    return user.username === this.authenticationService.getLoggedInUsername();
  }
}
