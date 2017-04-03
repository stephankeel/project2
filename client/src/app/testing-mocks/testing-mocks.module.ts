import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
  MockAllOfTypeComponent, MockAnalogViewComponent, MockAppBlindsButtonsComponent, MockAppFooterComponent,
  MockAppMovingBlindsComponent,
  MockChartViewComponent, MockDeviceOverviewComponent,
  MockListHeaderComponent,
  MockPChartComponent, MockPGrowlComponent, MockRouterComponent, MockSingleOfTypeComponent
} from './testing-mocks.component';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    MockListHeaderComponent,
    MockAnalogViewComponent,
    MockPChartComponent,
    MockAllOfTypeComponent,
    MockSingleOfTypeComponent,
    MockRouterComponent,
    MockChartViewComponent,
    MockAppBlindsButtonsComponent,
    MockAppMovingBlindsComponent,
    MockAppFooterComponent,
    MockDeviceOverviewComponent,
    MockPGrowlComponent,
  ],
  exports: [
    MockListHeaderComponent,
    MockAnalogViewComponent,
    MockPChartComponent,
    MockAllOfTypeComponent,
    MockSingleOfTypeComponent,
    MockRouterComponent,
    MockChartViewComponent,
    MockAppBlindsButtonsComponent,
    MockAppMovingBlindsComponent,
    MockAppFooterComponent,
    MockDeviceOverviewComponent,
    MockPGrowlComponent,
  ]
})
export class TestingMocksModule {
}
