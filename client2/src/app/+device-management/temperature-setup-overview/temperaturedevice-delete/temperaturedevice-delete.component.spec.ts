import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemperaturedeviceDeleteComponent } from './temperaturedevice-delete.component';

describe('TemperaturedeviceDeleteComponent', () => {
  let component: TemperaturedeviceDeleteComponent;
  let fixture: ComponentFixture<TemperaturedeviceDeleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TemperaturedeviceDeleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemperaturedeviceDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
