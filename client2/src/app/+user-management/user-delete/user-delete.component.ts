import {Component, OnInit, OnDestroy} from '@angular/core';
import {UsersService} from "../service/user.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Subscription} from "rxjs";
import {IUser} from "../../../../../server/entities/user.interface";

@Component({
  selector: 'app-user-delete',
  templateUrl: './user-delete.component.html',
  styleUrls: ['./user-delete.component.scss']
})
export class UserDeleteComponent implements OnInit, OnDestroy {
  private sub: Subscription;
  private user: IUser = {};

  constructor(private userService: UsersService, private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      if (params['id']) {
        this.userService.getDataService().subscribe(dataService => {
          this.user = dataService.getCache(params['id']);
        });
      }
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }


  deleteUser() {
    this.userService.getDataService().subscribe(dataService => {
      if (this.user.id) {
        dataService.getRestService().del(this.user.id).subscribe(user => {
          console.log(`user delete: ${JSON.stringify(this.user)}`);
          this.router.navigate(['../..'], {relativeTo: this.route});
        }, error => {
          console.log(`Error: user updated ${JSON.stringify(error)}`);
        });
      }
    });
  }

  cancel() {
    this.router.navigate(['../../users'], {relativeTo: this.route});
  }
}

