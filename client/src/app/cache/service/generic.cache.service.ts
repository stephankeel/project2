import {Injectable} from "@angular/core";
import {GenericService} from "../../remote/generic.service";
import {AuthHttp} from "angular2-jwt";
import {Observable, ReplaySubject} from "rxjs";
import {IId} from "../../../../../server/entities/id.interface";
import {ClientSocketService} from "../../remote/client-socket.service";
import {NotificationService} from "../../notification/notification.service";

@Injectable()
export class GenericeCacheService<T extends IId> {
  private dataService: GenericService<T>;
  private loaded: boolean;

  constructor(private http: AuthHttp,
              private socketService: ClientSocketService,
              private notificationService: NotificationService,
              private restUrl: string,
              private socketNamespace: string) {
    this.loaded = false;
  }

  public getDataService(): Observable<GenericService<T>> {
    let subject = new ReplaySubject<GenericService<T>>();
    if (!this.loaded) {
      this.dataService = new GenericService<T>(this.http, this.socketService, this.notificationService, this.restUrl, this.socketNamespace);
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

  public disconnect() {
    if (this.loaded) {
      this.dataService.disconnect();
      this.loaded = false;
    }
  }
}
