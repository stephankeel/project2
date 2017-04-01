import {GenericDataCacheService} from './generic-data-cache.service';
import {IHumidityData} from '../../../../../server/entities/data.interface';
import {GenericDataService} from '../../remote/generic-data.service';
import {AuthHttp} from 'angular2-jwt';
import {ClientSocketService} from '../../remote/client-socket.service';
import {IHumidityDevice} from '../../../../../server/entities/device.interface';
import {HumidityDeviceCacheService} from './humidity-device.cache.service';
import {Injectable} from '@angular/core';

@Injectable()
export class HumidityDataCacheService extends GenericDataCacheService<IHumidityData, IHumidityDevice> {

  constructor(private http: AuthHttp,
              private socketService: ClientSocketService,
              private humidityDeviceCacheService: HumidityDeviceCacheService) {
    super(humidityDeviceCacheService, id => {
      return new GenericDataService<IHumidityData>(this.http, this.socketService, '/api/data/humidity', '/humidity', id);
    });
  }
}
