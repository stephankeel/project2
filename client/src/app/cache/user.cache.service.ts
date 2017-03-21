import {Injectable} from "@angular/core";
import {AuthHttp} from "angular2-jwt";
import {GenericeCacheService} from "./generic.cache.service";
import {ClientSocketService} from "../remote/client-socket.service";
import {NotificationService} from "../notification/notification.service";
import {IUser} from "../../../../server/entities/user.interface";

@Injectable()
export class UserCacheService extends GenericeCacheService<IUser> {
  constructor(private authHttp: AuthHttp, private socketService1: ClientSocketService, private notificationService1: NotificationService) {
    super(authHttp, socketService1, notificationService1, "/api/users", "/users");
  }
}
