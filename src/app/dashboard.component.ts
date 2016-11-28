import {Component} from '@angular/core';
import {Router}    from '@angular/router';

import {GenericService} from './generic.service';

@Component({
    moduleId: module.id,
    selector: 'my-dashboard',
    templateUrl: 'dashboard.component.html',
    styleUrls: ['dashboard.component.css']
})

export class DashboardComponent {
    cssMenuClass: string = 'hideMenu';

    constructor(private genericService: GenericService,
                private router: Router) {
    }

    menuClicked(): void {
        console.log('Menu clicked ' + this.cssMenuClass);
        if (this.cssMenuClass === 'hideMenu') {
            this.cssMenuClass = 'showMenu';
        } else {
            this.cssMenuClass = 'hideMenu'
        }
    }

    closeMenu(): void {
        this.cssMenuClass = 'hideMenu';
    }

    manageUsers(): void {
        this.closeMenu();
        this.router.navigate(['/users']);
    }

    logout(): void {
        this.closeMenu();
        this.genericService.logout();
        this.router.navigate(['/login']);
    }

}
