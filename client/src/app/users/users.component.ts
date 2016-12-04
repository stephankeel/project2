import {Component, OnInit} from '@angular/core';
import {Router}    from '@angular/router';

import {GenericService} from '../generic.service';
import {User} from '../user';

@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.css']
})

export class UsersComponent implements OnInit {
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
        this.user.type = User.STANDARD;
        this.passwordConfirmation = null;
    }

    selectUser(user: User) {
        this.selectedUser = user;
        this.user = new User(this.selectedUser.id, this.selectedUser.firstname, this.selectedUser.lastname, this.selectedUser.type, this.selectedUser.username, this.selectedUser.password);
        this.passwordConfirmation = this.user.password;
    }

    setUserType(type: number) {
        if (type >= User.STANDARD && type <= User.GUEST) {
            this.user.type = type;
        } else {
            console.error('Unknow user type: ' + type);
        }
    }

    doAddOrUpdate(): void {
        if (this.user) {
            if (this.user.id) {
                this.genericService.updateUser(this.user).then(() => {
                    this.users[this.users.indexOf(this.selectedUser)] = this.user;
                    this.selectedUser = null;
                    this.user = null;
                }).catch(error => {
                    this.message = 'Update user failed with ' + (error.message || error )
                });
            } else {
                this.genericService.addUser(this.user).then(user => {
                    this.users.push(user);
                    this.selectedUser = null;
                    this.user = null;
                }).catch(error => {
                    this.message = 'Add user failed with ' + (error.message || error )
                });
            }
        }
    }

    doDelete(): void {
        if (this.user && this.user.id) {
            this.genericService.deleteUser(this.user).then(() => {
                this.users = this.users.filter(user => user.id != this.user.id);
                this.selectedUser = null;
                this.user = null;
            }).catch(error => {
                this.message = 'Delete user failed with ' + (error.message || error )
            });
        }
    }

    clearMessage(): void {
        this.message = null;
    }

    ngOnInit() {
    }

}
