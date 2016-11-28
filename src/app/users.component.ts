import {Component} from '@angular/core';
import {Router}    from '@angular/router';

import {GenericService} from './generic.service';
import {User} from './user';

@Component({
    moduleId: module.id,
    selector: 'my-users',
    styleUrls: ['users.component.css'],
    templateUrl: 'users.component.html'
})

export class UsersComponent {

    users: User[] = [];
    user: User;
    selectedUser: User;
    passwordConfirmation: string;
    message: string;

    constructor(private genericService: GenericService,
                private router: Router) {
        genericService.getUsers().then(users => {
            this.users = users;
        }).catch(error => {
            console.error(error);
        });
    }

    backClicked(): void {
        this.router.navigate(['/dashboard']);
    }

    addClicked(): void {
        this.user = new User();
        this.passwordConfirmation = null;
    }

    selectUser(user: User) {
        this.selectedUser = user;
        this.user = user;
        this.passwordConfirmation = this.user.password;
    }

    doAddOrUpdate(): void {
        if (this.user) {
            if (this.user.id) {
                // TODO: Update
            } else {
                // TODO: Add
            }
        }
    }

    doDelete(): void {
        if (this.user && this.user.id) {
            // TODO delete user
        }
    }

    clearMessage(): void {
        this.message = null;
    }

}
