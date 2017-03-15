import {Injectable, OnDestroy} from "@angular/core";
import {GenericService} from "../../remote/generic.service";
import {IUser} from "../../../../../server/entities/user.interface";
import {AuthHttp} from "angular2-jwt";
import {ClientSocketService} from "../../remote/client-socket.service";
import {Observable, Subject, ReplaySubject} from "rxjs";
import {NotificationService} from "../../notification/notification.service";

@Injectable()
export class UsersService implements OnDestroy {
  private dataService: GenericService<IUser>;
  private loaded: boolean;

  constructor(private http: AuthHttp, private socketService: ClientSocketService, private notificationService: NotificationService) {
    this.loaded = false;
  }

  public getDataService(): Observable<GenericService<IUser>> {
    let subject = new ReplaySubject<GenericService<IUser>>();
    if (!this.loaded) {
      this.dataService = new GenericService<IUser>(this.http, this.socketService, this.notificationService, "/api/users", "/users");
      this.dataService.getAll().subscribe(service => {
        subject.next(this.dataService);
        subject.complete();
        this.loaded = true;
      });
    } else {
      subject.next(this.dataService);
      subject.complete();
    }
    return subject;
  }

  ngOnDestroy() {
    if (this.loaded) {
      this.dataService.disconnect();
    }
  }
}
