import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {EqualValidatorDirective} from './equals-validator.directives';
import {NotEqualValidatorDirective} from './not-equals-validator.directives';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    EqualValidatorDirective,
    NotEqualValidatorDirective,
  ],
  exports: [
    EqualValidatorDirective,
    NotEqualValidatorDirective,
  ]
})
export class MiscValidatorsModule {
}
