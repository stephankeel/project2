import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AllHumiditiesComponent} from './all-humidities.component';
import {Component, Input} from '@angular/core';
import {DeviceType} from '../../../../../../../server/entities/device-type';

describe('AllHumiditiesComponent', () => {
  let component: AllHumiditiesComponent;
  let fixture: ComponentFixture<AllHumiditiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AllHumiditiesComponent,
        MockAllOfTypeComponent,
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

@Component({
  selector: 'app-all-of-type',
  template: '<div></div>',
})
class MockAllOfTypeComponent {
  @Input() deviceType: string;
}
