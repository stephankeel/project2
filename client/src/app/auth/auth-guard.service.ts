import {Injectable}       from '@angular/core';
import {
    CanActivate, Router,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    CanActivateChild
} from '@angular/router';

import {AuthenticationService}      from '../remote/authentication.service';

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {
    constructor(private authenticationService: AuthenticationService, private router: Router) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        let url: string = state.url;
        return this.checkLogin(url);
    }

    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        return this.canActivate(route, state);
    }

    checkLogin(url: string): boolean {
        if (this.authenticationService.loggedIn()) {
            return true;
        }
        // Store the attempted URL for redirecting
        this.authenticationService.redirectUrl = url;
        // Navigate to the login page
        this.router.navigate(['/login']);
        return false;
    }
}
