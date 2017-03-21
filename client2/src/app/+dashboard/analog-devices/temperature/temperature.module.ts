import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TemperatureRouterModule} from './router/temperature-router.module';
import {AuthGuard} from '../../../auth/auth-guard.service';
import {TemperatureComponent} from './temperature.component';
import {AllTemperaturesComponent} from './all-temperatures/all-temperatures.component';
import {SingleTemperatureComponent} from './single-temperature/single-temperature.component';
import {ListSupportModule} from '../../../list-support/list-support.module';
import {MaterialModule} from '@angular/material';
import {ChartModule} from 'primeng/primeng';
import {AllOfTypeComponent} from '../all-of-type/all-of-type.component';
import {ValuePipe} from '../pipes/value.pipe';
import {TimestampPipe} from '../pipes/timestamp.pipe';
import {TimestampFormatterPipe} from '../pipes/timestamp-formatter.pipe';
import {ValueSplitPipe} from '../pipes/value-split.pipe';
import {ChartViewComponent} from '../chart-view/chart-view.component';
import {AnalogViewComponent} from '../analog-view/analog-view.component';
import {SingleOfTypeComponent} from '../single-of-type/single-of-type.component';

@NgModule({
  imports: [
    CommonModule,
    ChartModule,
    MaterialModule,
    TemperatureRouterModule,
    ListSupportModule,
  ],
  declarations: [
    TemperatureComponent,
    AllTemperaturesComponent,
    SingleTemperatureComponent,
    AllOfTypeComponent,
    SingleOfTypeComponent,
    ValuePipe,
    TimestampPipe,
    TimestampFormatterPipe,
    ValueSplitPipe,
    AnalogViewComponent,
    ChartViewComponent,
  ],
  providers: [
    AuthGuard,
  ]
})
export class TemperatureModule {
}
