import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TemperatureDeviceCacheService} from './service/temperature-device.cache.service';
import {BlindsDeviceCacheService} from './service/blinds-device.cache.service';
import {HumidityDeviceCacheService} from './service/humidity-device.cache.service';
import {UserCacheService} from './service/user.cache.service';
import {TemperatureDataCacheService} from './service/temperature-data.cache.service';
import {HumidityDataCacheService} from './service/humidity-data.cache.service';
import {BlindDataCacheService} from './service/blinds-data.cache.service';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    BlindsDeviceCacheService,
    BlindDataCacheService,
    TemperatureDeviceCacheService,
    TemperatureDataCacheService,
    HumidityDeviceCacheService,
    HumidityDataCacheService,
    UserCacheService,
  ],
  declarations: []
})
export class CacheModule {
}
