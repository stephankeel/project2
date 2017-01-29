import {Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {AuthenticationService} from "../remote/authentication.service";
import {User, UserType} from "../user";
import {GenericService} from "../remote/generic.service";
import {AuthHttp} from "angular2-jwt";
import {ClientSocketService} from "../remote/client-socket.service";

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
  loggedInUsername: string;
  loggedInUserId: any;
  userTypes: UserType[] = User.getUserTypeValue();
  userTypeText: string[] = User.getUserTypeText();
  message: string;
  private genericService: GenericService<User>;

  constructor(private authenticationService: AuthenticationService,
              private router: Router,
              private socketService: ClientSocketService, private authHttp: AuthHttp) {
  }

  ngOnInit() {
    this.genericService = new GenericService<User>(this.authHttp,
      this.socketService, "/api/users", "/users");
    this.loggedInUsername = this.authenticationService.getLoggedInUsername();
    this.loggedInUserId = this.authenticationService.getLoggedInUserId();
    this.genericService.items.subscribe(users =>
      this.users = users.toArray()
    );
    this.genericService.getAll();
  }

  ngOnDestroy() {
    this.genericService.disconnect();
  }

  backClicked(): void {
    this.router.navigate(['/dashboard']);
  }

  addClicked(): void {
    this.user = new User();
    this.user.type = UserType.STANDARD;
    this.passwordConfirmation = null;
  }

  selectUser(user: User) {
    this.selectedUser = user;
    this.user = new User(this.selectedUser.id, this.selectedUser.firstname, this.selectedUser.lastname, this.selectedUser.type, this.selectedUser.username, this.selectedUser.password);
    this.passwordConfirmation = this.user.password;
  }

  setUserType(type: UserType) {
    this.user.type = type;
  }

  doAddOrUpdate(): void {
    if (this.user) {
      if (this.user.id) {
        this.genericService.update(this.user);
      } else {
        this.genericService.create(this.user);
      }
    }
  }

  doDelete(): void {
    if (this.user && this.user.id
    ) {
      this.genericService.del(this.user);
    }
  }

  clearMessage(): void {
    this.message = null;
  }
}
