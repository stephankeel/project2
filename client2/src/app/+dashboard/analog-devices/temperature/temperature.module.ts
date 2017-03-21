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
import {AllOfTypeModule} from "../all-of-type/all-of-type.module";
import {SingleOfTypeModule} from "../single-of-type/single-of-type.module";

@NgModule({
  imports: [
    CommonModule,
    ChartModule,
    MaterialModule,
    TemperatureRouterModule,
    ListSupportModule,
    AllOfTypeModule,
    SingleOfTypeModule,
  ],
  declarations: [
    TemperatureComponent,
    AllTemperaturesComponent,
    SingleTemperatureComponent,
  ],
  providers: [
    AuthGuard,
  ]
})
export class TemperatureModule {
}
