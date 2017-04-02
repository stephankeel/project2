import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AllTemperaturesComponent} from './all-temperatures.component';
import {DeviceType} from '../../../../../../../server/entities/device-type';
import {Component, Input} from '@angular/core';

describe('AllTemperaturesComponent', () => {
  let component: AllTemperaturesComponent;
  let fixture: ComponentFixture<AllTemperaturesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AllTemperaturesComponent,
        MockAllOfTypeComponent,
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

@Component({
  selector: 'app-all-of-type',
  template: '<div></div>',
})
class MockAllOfTypeComponent {
  @Input() deviceType: string;
}

