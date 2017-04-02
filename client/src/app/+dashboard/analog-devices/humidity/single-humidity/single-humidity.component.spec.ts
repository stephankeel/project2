import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {SingleHumidityComponent} from './single-humidity.component';
import {Component, Input} from '@angular/core';
import {DeviceType} from '../../../../../../../server/entities/device-type';

describe('SingleHumidityComponent', () => {
  let component: SingleHumidityComponent;
  let fixture: ComponentFixture<SingleHumidityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        SingleHumidityComponent,
        MockSingleOfTypeComponent,
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

@Component({
  selector: 'app-single-of-type',
  template: '<div></div>',
})
class MockSingleOfTypeComponent {
  @Input() deviceType: string;
}
