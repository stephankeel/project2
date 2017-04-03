import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TimestampFormatterPipe} from '../pipes/timestamp-formatter.pipe';
import {ValueSplitPipe} from '../pipes/value-split.pipe';
import {NotEmptyArrayPipe} from './not-empty-array.pipe';
import {EmptyArrayPipe} from './empty-array.pipe';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    TimestampFormatterPipe,
    ValueSplitPipe,
    NotEmptyArrayPipe,
    EmptyArrayPipe,
  ],
  exports: [
    TimestampFormatterPipe,
    ValueSplitPipe,
    NotEmptyArrayPipe,
    EmptyArrayPipe,
  ],
  providers: []
})
export class PipesModule {
}
