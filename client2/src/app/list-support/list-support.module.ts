import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {LineComponent} from "./line/line.component";
import {MaterialModule} from "@angular/material";
import {ListHeaderComponent} from "./list-header/list-header.component";

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
  ],
  declarations: [
    LineComponent,
    ListHeaderComponent
  ],
  exports: [
    LineComponent,
    ListHeaderComponent,
  ]
})
export class ListSupportModule {
}
