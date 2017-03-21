import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TemperatureDeviceCacheService} from "./temperature-device.cache.service";
import {BlindsDeviceCacheService} from "./blinds-device.cache.service";
import {HumidityDeviceCacheService} from "./humidity-device.cache.service";
import {UserCacheService} from "./user.cache.service";

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    BlindsDeviceCacheService,
    TemperatureDeviceCacheService,
    HumidityDeviceCacheService,
    UserCacheService,
  ],
  declarations: []
})
export class CacheModule {
}
