import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MaterialModule} from '@angular/material';
import {DeviceOverviewComponent} from './device-overview/device-overview.component';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
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
