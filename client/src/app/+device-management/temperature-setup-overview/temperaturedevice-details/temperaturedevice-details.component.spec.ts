import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemperaturedeviceDetailsComponent } from './temperaturedevice-details.component';

describe('TemperaturedeviceDetailsComponent', () => {
  let component: TemperaturedeviceDetailsComponent;
  let fixture: ComponentFixture<TemperaturedeviceDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TemperaturedeviceDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemperaturedeviceDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
