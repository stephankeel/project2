import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemperaturedeviceChangeComponent } from './temperaturedevice-change.component';

describe('TemperaturedeviceChangeComponent', () => {
  let component: TemperaturedeviceChangeComponent;
  let fixture: ComponentFixture<TemperaturedeviceChangeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TemperaturedeviceChangeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemperaturedeviceChangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
