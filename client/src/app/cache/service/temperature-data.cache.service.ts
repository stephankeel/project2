import {GenericDataCacheService} from './generic-data-cache.service';
import {ITemperatureData} from '../../../../../server/entities/data.interface';
import {GenericDataService} from '../../remote/generic-data.service';
import {AuthHttp} from 'angular2-jwt';
import {ClientSocketService} from '../../remote/client-socket.service';
import {TemperatureDeviceCacheService} from './temperature-device.cache.service';
import {IAnalogDevice} from '../../../../../server/entities/device.interface';
import {Injectable} from '@angular/core';

@Injectable()
export class TemperatureDataCacheService extends GenericDataCacheService<ITemperatureData, IAnalogDevice> {

  constructor(private http: AuthHttp,
              private socketService: ClientSocketService,
              private temperatureDeviceCacheService: TemperatureDeviceCacheService) {
    super(temperatureDeviceCacheService, id => {
      return new GenericDataService<ITemperatureData>(this.http, this.socketService, '/api/data/temperature', '/temperature', id);
    });
  }
}
