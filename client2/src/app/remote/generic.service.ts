import {ReplaySubject, Subscription, Observable, Subject} from "rxjs";
import {ClientSocketService} from "./client-socket.service";
import {List, Seq, Iterator} from "immutable";
import {IId} from "../../../../server/entities/id.interface";
import {AuthHttp} from "angular2-jwt";
import {ISocketItem} from "../../../../server/entities/socket-item.model";
import {GenericRestService} from "./generic-rest.service";
import {NotificationService} from "../notification/notification.service";

export class GenericService<T extends IId> {
  items: ReplaySubject<List<T>> = new ReplaySubject<List<T>>(1);
  private currentItems: Map<string, T> = new Map<string, T>();
  private dataSubscription: Subscription;
  private restService: GenericRestService<T>;

  constructor(private authHttp: AuthHttp, private socketService: ClientSocketService,
              private notificationService: NotificationService,
              private restUrl: string, private socketNamespace: string) {
    this.restService = new GenericRestService<T>(authHttp, restUrl);
    let observable = socketService.get(socketNamespace);
    this.dataSubscription = observable.subscribe((item: ISocketItem) => this.processItem(item));
  }

  public disconnect() {
    this.dataSubscription.unsubscribe();
  }

  public getCache(id: string): T {
    return this.currentItems.get(id);
  }

  public getAllFromCache(): T[] {
    let ret: T[] = [];
    this.currentItems.forEach((v: T) => ret.push(v));
    return ret;
  }

  public getCount(): number {
    return this.currentItems.size;
  }

  public getRestService(): GenericRestService<T> {
    return this.restService;
  }

  private processItem(packet: ISocketItem) {
    if (packet.action === "create") {
      this.addItem(packet.item);
    } else if (packet.action === "update") {
      this.updateItem(packet.item);
    } else if (packet.action === "delete") {
      this.deleteItem(packet.item);
    }
  }

  public create(item: T) {
    this.restService.add(item).subscribe((item: T) => {
      this.notificationService.success('Created successfully');
      this.addItem(item);
    }, (err: any) => {
      this.notificationService.error(err.toString(), 'Creation failed');
      this.items.error(err);
    });
  }

  public update(item: T) {
    this.restService.update(item).subscribe((item: T) => {
      this.notificationService.success('Updated successfully');
      this.updateItem(item);
    }, (err: any) => {
      this.notificationService.error(err.toString(), 'Update failed');
      this.items.error(err);
    });
  }

  public del(id: string) {
    this.restService.del(id).subscribe((id: string) => {
      this.notificationService.success('Deleted successfully');
      this.deleteItem(id);
    }, (err: any) => {
      this.notificationService.error(err.toString(), 'Deletion failed');
      this.items.error(err);
    });
  }

  public getAll(): Observable<T[]> {
    let subject = new Subject<T[]>();
    this.restService.getAll().subscribe((items: T[]) => {
      this.addAll(items);
      subject.next(items);
      subject.complete();
    }, (err: any) => {
      this.notificationService.error(`getAll failed with ${err.toString()}`);
      this.items.error(err);
      subject.error(err);
    });
    return subject;
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

  private deleteItem(id: string) {
    if (this.currentItems.has(id)) {
      this.currentItems.delete(id);
      this.items.next(List<T>(this.currentItems.values()));
    }
  }
}
