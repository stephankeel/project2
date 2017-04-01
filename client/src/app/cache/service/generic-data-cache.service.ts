import {IId} from '../../../../../server/entities/id.interface';
import {Observable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';
import {GenericDataService} from '../../remote/generic-data.service';
import {DeviceDataCache} from './device-data-cache';
import {GenericeCacheService} from './generic.cache.service';

/**
 * @param <T> DataType
 * @param <U> DeviceType
 */
export class GenericDataCacheService<T extends IId, U extends IId> {

  private deviceMap: Map<string, DeviceDataCache<T>> = new Map<string, DeviceDataCache<T>>();
  private subscription: Subscription[] = [];

  constructor(private genericCacheService: GenericeCacheService<U>,
              private createDataService: (id: string) => GenericDataService<T>) {
    this.genericCacheService.getAll().subscribe(items => {
      this.cleanupCache(items);
    });
  }

  private cleanupCache(items) {
    const idSet: Set<string> = this.convertToIdSet(items);
    this.deviceMap.forEach((value, key) => {
      if (!idSet.has(key)) {
        this.deviceMap.get(key).unregister();
      }
    });
  }

  private convertToIdSet(items): Set<string> {
    const idSet: Set<string> = new Set<string>();
    items.forEach(item => {
      idSet.add(item.id);
    });
    return idSet;
  }

  public getAllData(deviceId: string): Observable<T[]> {
    if (!this.deviceMap.has(deviceId)) {
      this.deviceMap.set(deviceId, this.createEntry(deviceId));
    }
    return this.deviceMap.get(deviceId).getAll();
  }

  public getLatestData(deviceId: string): Observable<T> {
    if (!this.deviceMap.has(deviceId)) {
      this.deviceMap.set(deviceId, this.createEntry(deviceId));
    }
    return this.deviceMap.get(deviceId).getLatest();
  }

  private createEntry(deviceId: string) {
    return new DeviceDataCache(this.createDataService, deviceId);
  }
}
