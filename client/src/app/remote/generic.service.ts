import {ReplaySubject, Observable} from "rxjs";
import {ClientSocketService} from "./client-socket.service";
import {List} from "immutable";
import {GenericRestService} from "./generic-rest.service";
import {IId} from "../../../../server/entities/id.interface";
import {AuthHttp} from "angular2-jwt";
import {ClientContextService} from "../service/client-context.service";
import {ISocketItem} from "../../../../server/entities/socket-item.model";
import {forEach} from "@angular/router/src/utils/collection";

export class GenericService<T extends IId> {
  items: ReplaySubject<List<T>> = new ReplaySubject<List<T>>(1);
  private currentItems: Map<string, T> = new Map<string, T>();
  private socket: Observable<ISocketItem>;
  private restService: GenericRestService<T>;

  constructor(private authHttp: AuthHttp, private socketService: ClientSocketService,
              private restUrl: string, private socketNamespace: string) {
    this.restService = new GenericRestService<T>(authHttp, restUrl);
    this.socket = socketService.get(socketNamespace);
    this.socket.subscribe((item: ISocketItem) => this.processItem(item));
  }

  private processItem(packet: ISocketItem) {
    if (packet.action === "create") {
      this.addItem(packet.item);
    } else if (packet.action === "update") {
      this.updateItem(packet.item);
    } else if (packet.action === "delete") {
      this.currentItems.delete(packet.item);
    }
    this.items.next(List<T>(this.currentItems.values()));
  }

  public create(item: T) {
    this.restService.add(item).subscribe((item: T) => {
      this.addItem(item);
    });
  }

  public update(item: T) {
    this.restService.update(item).subscribe((item: T) => {
      this.updateItem(item);
    });
  }

  public del(item: T) {
    this.restService.del(item).subscribe((item: T) => {
      this.deleteItem(item);
    });
  }

  public getAll() {
    this.restService.getAll().subscribe((items: T[]) => {
      this.addAll(items);
    });
  }

  private addAll(items: T[]) {
    this.currentItems = new Map<string, T>();
    for (let item of items) {
      this.currentItems.set(item.id, item);
    }
    this.items.next(List<T>(this.currentItems.values()));
  }

  private addItem(item: T) {
    if (!this.currentItems.has(item.id)) {
      this.currentItems.set(item.id, item);
      this.items.next(List<T>(this.currentItems.values()));
    }
  }

  private updateItem(item: T) {
    if (this.currentItems.get(item.id) !== item) {
      this.currentItems.set(item.id, item);
      this.items.next(List<T>(this.currentItems.values()));
    }
  }

  private deleteItem(item: T) {
    if (this.currentItems.has(item.id)) {
      this.currentItems.delete(item.id);
      this.items.next(List<T>(this.currentItems.values()));
    }
  }
}
