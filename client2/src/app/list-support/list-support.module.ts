import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LineComponent} from './line/line.component';
import {MaterialModule} from "@angular/material";

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
  ],
  declarations: [
    LineComponent
  ],
  exports: [
    LineComponent,
  ]
})
export class ListSupportModule {
}
