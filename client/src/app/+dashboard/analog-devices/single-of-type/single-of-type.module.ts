import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AuthGuard} from '../../../auth/auth-guard.service';
import {ListSupportModule} from '../../../list-support/list-support.module';
import {MaterialModule} from '@angular/material';
import {ChartModule} from 'primeng/primeng';
import {SingleOfTypeComponent} from '../single-of-type/single-of-type.component';
import {ChartViewModule} from '../chart-view/chart-view.module';
import {AnalogViewModule} from '../analog-view/analog-view.module';
import {PipesModule} from '../pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    ChartModule,
    MaterialModule,
    ListSupportModule,
    ChartViewModule,
    AnalogViewModule,
    PipesModule,
  ],
  declarations: [
    SingleOfTypeComponent,
  ],
  exports: [
    SingleOfTypeComponent,
  ],
  providers: [
    AuthGuard,
  ]
})
export class SingleOfTypeModule {
}
