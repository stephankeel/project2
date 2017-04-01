import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AuthGuard} from '../../../auth/auth-guard.service';
import {ListSupportModule} from '../../../list-support/list-support.module';
import {MaterialModule} from '@angular/material';
import {ChartModule} from 'primeng/primeng';
import {AllOfTypeComponent} from '../all-of-type/all-of-type.component';
import {PipesModule} from '../pipes/pipes.module';
import {AnalogViewModule} from '../analog-view/analog-view.module';

@NgModule({
  imports: [
    CommonModule,
    ChartModule,
    MaterialModule,
    ListSupportModule,
    PipesModule,
    AnalogViewModule,
  ],
  declarations: [
    AllOfTypeComponent,
  ],
  exports: [
    AllOfTypeComponent,
  ],
  providers: [
    AuthGuard,
  ]
})
export class AllOfTypeModule {
}
