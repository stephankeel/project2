import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ValuePipe} from '../pipes/value.pipe';
import {TimestampPipe} from '../pipes/timestamp.pipe';
import {TimestampFormatterPipe} from '../pipes/timestamp-formatter.pipe';
import {ValueSplitPipe} from '../pipes/value-split.pipe';
import {NamePipe} from './name.pipe';
import {NotEmptyArrayPipe} from "./not-empty-array.pipe";
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
    NotEmptyArrayPipe,
    EmptyArrayPipe,
  ],
  exports: [
    ValuePipe,
    TimestampPipe,
    TimestampFormatterPipe,
    ValueSplitPipe,
    NamePipe,
    NotEmptyArrayPipe,
    EmptyArrayPipe,
  ],
  providers: []
})
export class PipesModule {
}
