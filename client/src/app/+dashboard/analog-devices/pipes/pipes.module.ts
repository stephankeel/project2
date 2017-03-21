import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ValuePipe} from '../pipes/value.pipe';
import {TimestampPipe} from '../pipes/timestamp.pipe';
import {TimestampFormatterPipe} from '../pipes/timestamp-formatter.pipe';
import {ValueSplitPipe} from '../pipes/value-split.pipe';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    ValuePipe,
    TimestampPipe,
    TimestampFormatterPipe,
    ValueSplitPipe,
  ],
  exports: [
    ValuePipe,
    TimestampPipe,
    TimestampFormatterPipe,
    ValueSplitPipe,
  ],
  providers: [
  ]
})
export class PipesModule {
}
