import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {SingleTemperatureComponent} from './single-temperature.component';
import {DeviceType} from '../../../../../../../server/entities/device-type';
import {TestingMocksModule} from '../../../../testing-mocks/testing-mocks.module';

describe('SingleTemperatureComponent', () => {
  let component: SingleTemperatureComponent;
  let fixture: ComponentFixture<SingleTemperatureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        TestingMocksModule,
      ],
      declarations: [
        SingleTemperatureComponent,
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleTemperatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set type to temperature', () => {
    const singleOfTypeComponent = fixture.debugElement.children[0];
    expect(singleOfTypeComponent.context.deviceType).toBe(DeviceType.TEMPERATURE);
  });
});
