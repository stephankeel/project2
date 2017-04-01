import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot} from '@angular/router';


import {AuthenticationService} from '../remote/authentication.service';
import {UserType} from '../../../../server/entities/user-type';

@Injectable()
export class AdminGuard implements CanActivate, CanActivateChild {

  constructor(private authenticationService: AuthenticationService, private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.checkUserTpye();
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.canActivate(route, state);
  }

  checkUserTpye(): boolean {
    if (this.authenticationService.loggedIn()) {
      const userType: UserType = this.authenticationService.getLoggedInUserType();
      return userType === UserType.ADMIN;
    }
    return false;
  }
}
