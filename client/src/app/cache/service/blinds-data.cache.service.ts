import {GenericDataCacheService} from './generic-data-cache.service';
import {IBlindsData} from '../../../../../server/entities/data.interface';
import {GenericDataService} from '../../remote/generic-data.service';
import {AuthHttp} from 'angular2-jwt';
import {ClientSocketService} from '../../remote/client-socket.service';
import {BlindsDeviceCacheService} from './blinds-device.cache.service';
import {IBlindsDevice} from '../../../../../server/entities/device.interface';
import {Injectable} from '@angular/core';

@Injectable()
export class BlindDataCacheService extends GenericDataCacheService<IBlindsData, IBlindsDevice> {

  constructor(private http: AuthHttp,
              private socketService: ClientSocketService,
              private  blindsDeviceCacheService: BlindsDeviceCacheService) {
    super(blindsDeviceCacheService, id => {
      return new GenericDataService<IBlindsData>(this.http, this.socketService, '/api/data/blinds', '/blinds', id);
    });
  }
}
