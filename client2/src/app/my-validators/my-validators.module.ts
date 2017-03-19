import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {EqualValidator} from "./equals-validator.directives";

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    EqualValidator,
  ],
  exports: [
    EqualValidator,
  ]
})
export class MyValidatorsModule { }
