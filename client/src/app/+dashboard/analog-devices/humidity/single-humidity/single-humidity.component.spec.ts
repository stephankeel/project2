import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {SingleHumidityComponent} from './single-humidity.component';
import {DeviceType} from '../../../../../../../server/entities/device-type';
import {TestingMocksModule} from '../../../../testing-mocks/testing-mocks.module';

describe('SingleHumidityComponent', () => {
  let component: SingleHumidityComponent;
  let fixture: ComponentFixture<SingleHumidityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        TestingMocksModule,
      ],
      declarations: [
        SingleHumidityComponent,
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleHumidityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set type to humidity', () => {
    const singleOfTypeComponent = fixture.debugElement.children[0];
    expect(singleOfTypeComponent.context.deviceType).toBe(DeviceType.HUMIDITY);
  });
});
