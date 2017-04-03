import {Injectable} from '@angular/core';
import {GenericService} from '../../remote/generic.service';
import {AuthHttp} from 'angular2-jwt';
import {Observable} from 'rxjs/Observable';
import {ReplaySubject} from 'rxjs/ReplaySubject';
import {IId} from '../../../../../server/entities/id.interface';
import {ClientSocketService} from '../../remote/client-socket.service';
import {NotificationService} from '../../notification/notification.service';

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

  private ensureAllLoaded() {
    if (!this.loaded) {
      this.dataService = new GenericService<T>(this.http, this.socketService, this.notificationService, this.restUrl, this.socketNamespace);
      this.dataService.getAll();
      this.loaded = true;
    }
  }

  /**
   * This method return a Observable with one call to next, then the observable is completed.
   * If the device is not in the list of all devices, an error occures.
   */
  public getDevice(deviceId: string): Observable<T> {
    this.ensureAllLoaded();
    const subject: ReplaySubject<T> = new ReplaySubject<T>(1);
    const subscription = this.getAll().subscribe(allDevices => {
      const searchedDevice = allDevices.filter(device => device.id === deviceId);
      if (searchedDevice.length === 1) {
        subject.next(searchedDevice[0]);
      } else {
        subject.error(`Das gesuchte Device (${deviceId}) existiert nicht!`);
      }
      subject.complete();
    });
    // Can not unsubscribe after the complete call above, because, if the subscribe of getAll returns immediately,
    // the subscription is not still undefined. So subscribe myself to the subject and do the unsubscribe when the
    // subscription is set for sure.
    subject.subscribe(device => {
      subscription.unsubscribe();
    });
    return subject;
  }

  /**
   * This method deletes the device
   * @param deviceId Id of the device to delete.
   * @returns {Observable<string>} with his own id when deletion is done
   */
  public delDevice(deviceId: string): Observable<string> {
    this.ensureAllLoaded();
    return this.dataService.getRestService().del(deviceId);
  }

  /**
   * This method adds a new device
   * @param device The device to add.
   * @returns {Observable<T>} one next with the added device
   */
  public addDevice(device: T) {
    this.ensureAllLoaded();
    return this.dataService.getRestService().add(device);
  }

  /**
   * This method updates a device
   * @param device The device to update.
   * @returns {Observable<T>} one next with the updated device
   */
  public updateDevice(device: T) {
    this.ensureAllLoaded();
    return this.dataService.getRestService().update(device);
  }

  /**
   * The method getAll returns an Observable with a array of
   * devices until unsubscription. On every update, there is a new array.
   */
  public getAll(): Observable<T[]> {
    this.ensureAllLoaded();
    return this.dataService.items;
  }

  public disconnect() {
    if (this.loaded) {
      this.dataService.disconnect();
      this.loaded = false;
    }
  }
}
