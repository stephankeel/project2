import {Component, OnInit} from '@angular/core';
import {Router}    from '@angular/router';

import {AuthenticationService} from '../remote/authentication.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {
  cssMenuClass: string = 'hideMenu';

  constructor(private authenticationService: AuthenticationService,
              private router: Router) {
  }

  menuClicked(): void {
    console.log('Menu clicked ' + this.cssMenuClass);
    if (this.cssMenuClass === 'hideMenu') {
      this.cssMenuClass = 'showMenu';
    } else {
      this.cssMenuClass = 'hideMenu';
    }
  }

  closeMenu(): void {
    this.cssMenuClass = 'hideMenu';
  }

  manageUsers(): void {
    this.closeMenu();
    this.router.navigate(['/users']);
  }

  temperature(): void {
    this.router.navigate(['/temperature']);
  }

  logout(): void {
    this.closeMenu();
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }

  ngOnInit() {
  }
}
