import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {EqualValidator} from "./equals-validator.directives";
import {NotEqualValidator} from "./not-equals-validator.directives";

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    EqualValidator,
    NotEqualValidator,
  ],
  exports: [
    EqualValidator,
    NotEqualValidator,
  ]
})
export class MiscValidatorsModule {
}
