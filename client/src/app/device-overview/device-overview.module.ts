import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DeviceOverviewComponent} from "./device-overview/device-overview.component";

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    DeviceOverviewComponent,
  ],
  exports: [
    DeviceOverviewComponent,
  ]
})
export class DeviceOverviewModule {
}
