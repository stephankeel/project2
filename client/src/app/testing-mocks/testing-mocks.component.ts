/* tslint:disable:component-selector */
import {Component, Input} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {IAnalogData} from '../../../../server/entities/data.interface';

@Component({
  selector: 'app-list-header',
  template: '',
})
export class MockListHeaderComponent {
  @Input() title: string;
  @Input() backlink: string;
  @Input() showBack: boolean;
  @Input() showCreate: boolean;
  @Input() disableCreate: boolean;
  @Input() showShowAll: boolean;
}

@Component({
  selector: 'app-analog-view',
  template: '',
})
export class MockAnalogViewComponent {
  @Input() name: string;
  @Input() value: number;
  @Input() units: string;
  @Input() timestamp: number;
}

@Component({
  selector: 'p-chart',
  template: '',
})
export class MockPChartComponent {
  @Input() type: string;
  @Input() data: any;

  refresh() {
  }
}

@Component({
  selector: 'app-all-of-type',
  template: '',
})
export class MockAllOfTypeComponent {
  @Input() deviceType: string;
}

@Component({
  selector: 'app-single-of-type',
  template: '',
})
export class MockSingleOfTypeComponent {
  @Input() deviceType: string;
}

@Component({
  selector: 'router-outlet',
  template: '',
})
export class MockRouterComponent {
}

@Component({
  selector: 'app-chart-view',
  template: '',
})
export class MockChartViewComponent {
  @Input() deviceDataHistory: Observable<IAnalogData[]>;
  @Input() label: string;
}

@Component({
  selector: 'app-blinds-buttons',
  template: '',
})
export class MockAppBlindsButtonsComponent {
  @Input() deviceId: string;
}

@Component({
  selector: 'app-moving-blinds',
  template: '',
})
export class MockAppMovingBlindsComponent {
  @Input() name: string;
  @Input() percentageDown: number;
}


@Component({
  selector: 'app-footer',
  template: '',
})
export class MockAppFooterComponent {
}

@Component({
  selector: 'app-device-overview',
  template: '',
})
export class MockDeviceOverviewComponent {
}

@Component({
  selector: 'p-growl',
  template: '',
})
export class MockPGrowlComponent {
  @Input() life: number;
  @Input() value: any;
}


