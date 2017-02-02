import {Component, OnInit} from '@angular/core';
import {Router}    from '@angular/router';
import {DeviceType, DeviceCharacteristics, devicePool} from '../device-pool';
import {UserType} from '../user';

import {AuthenticationService} from '../remote/authentication.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {
  cssMenuClass: string = 'hideMenu';
  devices: DeviceCharacteristics[] = devicePool;
  isAdmin: boolean;

  constructor(private authenticationService: AuthenticationService,
              private router: Router) {
  }

  ngOnInit() {
    this.isAdmin = this.authenticationService.getLoggedInUserType() == UserType.ADMIN;
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

  deviceSetup(): void {
    this.closeMenu();
    if (this.isAdmin) {
      this.router.navigate(['/devices']);
    }
  }

  manageUsers(): void {
    this.closeMenu();
    if (this.isAdmin) {
      this.router.navigate(['/users']);
    }
  }

  showInfo(): void {
    this.closeMenu();
    // TODO: this.router.navigate(['/info']);
  }

  logout(): void {
    this.closeMenu();
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }

  clickAction(device: DeviceCharacteristics): void {
    switch (device.type) {
      case DeviceType.BLINDS:
        // TODO: this.router.navigate(['/blinds']);
        break;
      case DeviceType.HUMIDITY:
        // TODO: this.router.navigate(['/humidity']);
        break;
      case DeviceType.TEMPERATURE:
        this.router.navigate(['/temperature']);
        break;
    }
  }

}
