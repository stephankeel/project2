import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AllTemperaturesComponent} from './all-temperatures.component';
import {DeviceType} from '../../../../../../../server/entities/device-type';
import {TestingMocksModule} from '../../../../testing-mocks/testing-mocks.module';

describe('AllTemperaturesComponent', () => {
  let component: AllTemperaturesComponent;
  let fixture: ComponentFixture<AllTemperaturesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        TestingMocksModule,
      ],
      declarations: [
        AllTemperaturesComponent,
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllTemperaturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set type to temperature', () => {
    const allOfTypeComponent = fixture.debugElement.children[0];
    expect(allOfTypeComponent.context.deviceType).toBe(DeviceType.TEMPERATURE);
  });
});

