import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AllHumiditiesComponent} from './all-humidities.component';
import {DeviceType} from '../../../../../../../server/entities/device-type';
import {TestingMocksModule} from '../../../../testing-mocks/testing-mocks.module';

describe('AllHumiditiesComponent', () => {
  let component: AllHumiditiesComponent;
  let fixture: ComponentFixture<AllHumiditiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        TestingMocksModule,
      ],
      declarations: [
        AllHumiditiesComponent,
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllHumiditiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set type to humidity', () => {
    const allOfTypeComponent = fixture.debugElement.children[0];
    expect(allOfTypeComponent.context.deviceType).toBe(DeviceType.HUMIDITY);
  });

});
