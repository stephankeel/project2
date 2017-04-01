import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HumidityRouterModule} from './router/humidity-router.module';
import {AuthGuard} from '../../../auth/auth-guard.service';
import {HumidityComponent} from './humidity.component';
import {AllHumiditiesComponent} from './all-humidities/all-humidities.component';
import {SingleHumidityComponent} from './single-humidity/single-humidity.component';
import {ListSupportModule} from '../../../list-support/list-support.module';
import {MaterialModule} from '@angular/material';
import {ChartModule} from 'primeng/primeng';
import {AllOfTypeModule} from '../all-of-type/all-of-type.module';
import {SingleOfTypeModule} from '../single-of-type/single-of-type.module';

@NgModule({
  imports: [
    CommonModule,
    ChartModule,
    MaterialModule,
    HumidityRouterModule,
    ListSupportModule,
    AllOfTypeModule,
    SingleOfTypeModule,
  ],
  declarations: [
    HumidityComponent,
    AllHumiditiesComponent,
    SingleHumidityComponent,
  ],
  providers: [
    AuthGuard,
  ]
})
export class HumidityModule {
}
