import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllAnalogDevicesComponent } from './all-analog-devices.component';

describe('AllAnalogDevicesComponent', () => {
  let component: AllAnalogDevicesComponent;
  let fixture: ComponentFixture<AllAnalogDevicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllAnalogDevicesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllAnalogDevicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
