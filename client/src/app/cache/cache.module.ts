import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {TemperatureDeviceCacheService} from "./service/temperature-device.cache.service";
import {BlindsDeviceCacheService} from "./service/blinds-device.cache.service";
import {HumidityDeviceCacheService} from "./service/humidity-device.cache.service";
import {UserCacheService} from "./service/user.cache.service";

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
