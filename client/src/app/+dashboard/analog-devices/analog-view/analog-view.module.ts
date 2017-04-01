import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MaterialModule} from '@angular/material';
import {AnalogViewComponent} from '../analog-view/analog-view.component';
import {PipesModule} from '../pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    PipesModule,
  ],
  declarations: [
    AnalogViewComponent,
  ],
  exports: [
    AnalogViewComponent
  ],
  providers: []
})
export class AnalogViewModule {
}
