import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TemperatureRouterModule} from '../router/temperature-router.module';
import {AuthGuard} from '../../../auth/auth-guard.service';
import {TemperatureComponent} from './temperature.component';
import {AllTemperaturesComponent} from '../all-temperatures/all-temperatures.component';
import {AnalogViewComponent} from '../analog-view/analog-view.component';
import {ValuePipe} from '../pipes/value.pipe';
import {TimestampPipe} from '../pipes/timestamp.pipe';
import {TimestampFormatterPipe} from '../pipes/timestamp-formatter.pipe';
import {ValueSplitPipe} from '../pipes/value-split.pipe';

@NgModule({
  imports: [
    CommonModule,
    TemperatureRouterModule,
  ],
  declarations: [
    TemperatureComponent,
    AllTemperaturesComponent,
    AnalogViewComponent,
    ValuePipe,
    TimestampPipe,
    TimestampFormatterPipe,
    ValueSplitPipe,
  ],
  providers: [
    AuthGuard,
  ]
})
export class TemperatureModule { }
