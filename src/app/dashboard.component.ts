import {Component} from '@angular/core';

@Component({
    moduleId: module.id,
    selector: 'my-dashboard',
    templateUrl: 'dashboard.component.html'
})

export class DashboardComponent {
    cssMenuClass: string = 'hideMenu';

    menuClicked(): void {
        console.log('Menu clicked ' + this.cssMenuClass);
        if (this.cssMenuClass === 'hideMenu') {
            this.cssMenuClass = 'showMenu';
        } else {
            this.cssMenuClass = 'hideMenu'
        }
    }
}
