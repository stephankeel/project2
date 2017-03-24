import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ValuePipe} from '../pipes/value.pipe';
import {TimestampPipe} from '../pipes/timestamp.pipe';
import {TimestampFormatterPipe} from '../pipes/timestamp-formatter.pipe';
import {ValueSplitPipe} from '../pipes/value-split.pipe';
import { NamePipe } from './name.pipe';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    ValuePipe,
    TimestampPipe,
    TimestampFormatterPipe,
    ValueSplitPipe,
    NamePipe,
  ],
  exports: [
    ValuePipe,
    TimestampPipe,
    TimestampFormatterPipe,
    ValueSplitPipe,
    NamePipe,
  ],
  providers: [
  ]
})
export class PipesModule {
}
