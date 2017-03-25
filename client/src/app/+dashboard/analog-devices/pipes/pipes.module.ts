import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ValuePipe} from '../pipes/value.pipe';
import {TimestampPipe} from '../pipes/timestamp.pipe';
import {TimestampFormatterPipe} from '../pipes/timestamp-formatter.pipe';
import {ValueSplitPipe} from '../pipes/value-split.pipe';
import {NamePipe} from './name.pipe';
import {NotEmptyPipe} from "./not-empty.pipe";
import {EmptyArrayPipe} from './empty-array.pipe';

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
    NotEmptyPipe,
    EmptyArrayPipe,
  ],
  exports: [
    ValuePipe,
    TimestampPipe,
    TimestampFormatterPipe,
    ValueSplitPipe,
    NamePipe,
    NotEmptyPipe,
    EmptyArrayPipe,
  ],
  providers: []
})
export class PipesModule {
}
