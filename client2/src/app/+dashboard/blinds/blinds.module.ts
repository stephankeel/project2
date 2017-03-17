import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MaterialModule} from "@angular/material";
import {BlindsRouterModule} from './blinds-router/blinds-router.module';
import {AllBlindsComponent} from './all-blinds/all-blinds.component';
import {SingleBlindsComponent} from './single-blinds/single-blinds.component';
import {BlindsButtonsComponent} from './blinds-buttons/blinds-buttons.component';
import {MovingBlindsComponent} from './moving-blinds/moving-blinds.component';
import {BlindsDataObservablePipe} from './pipes/blinds-data-observable.pipe';
import {BlindsDataFormatterPipe} from './pipes/blinds-data-formatter.pipe';
import {BlindsPercentageDownPipe} from './pipes/blinds-percentage-down.pipe';
import {AuthGuard} from '../../auth/auth-guard.service';
import {BlindsComponent} from './blinds.component';
import {BlindsCommandService} from '../../remote/blinds-command.service';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    BlindsRouterModule,
  ],
  declarations: [
    BlindsComponent,
    AllBlindsComponent,
    SingleBlindsComponent,
    BlindsButtonsComponent,
    MovingBlindsComponent,
    BlindsDataObservablePipe,
    BlindsDataFormatterPipe,
    BlindsPercentageDownPipe,
  ],
  providers: [
    AuthGuard,
    BlindsCommandService,
  ],
})
export class BlindsModule {
}
