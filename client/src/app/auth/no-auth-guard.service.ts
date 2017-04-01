import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot} from '@angular/router';

import {AuthenticationService} from '../remote/authentication.service';

@Injectable()
export class NoAuthGuard implements CanActivate, CanActivateChild {

  constructor(private authenticationService: AuthenticationService, private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.checkLogin();
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.canActivate(route, state);
  }

  checkLogin(): boolean {
    if (this.authenticationService.loggedIn()) {
      this.router.navigate(['']);
      return false;
    }
    return true;
  }
}
