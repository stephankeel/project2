import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MaterialModule} from '@angular/material';
import {ChartModule} from 'primeng/primeng';
import {ChartViewComponent} from '../chart-view/chart-view.component';
import {PipesModule} from "../pipes/pipes.module";

@NgModule({
  imports: [
    CommonModule,
    ChartModule,
    MaterialModule,
    PipesModule,
  ],
  declarations: [
    ChartViewComponent,
  ],
  exports: [
    ChartViewComponent,
  ],
  providers: [
  ]
})
export class ChartViewModule {
}
