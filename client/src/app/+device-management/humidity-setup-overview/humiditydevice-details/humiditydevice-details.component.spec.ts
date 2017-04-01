import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {HumiditydeviceDetailsComponent} from './humiditydevice-details.component';

describe('HumiditydeviceDetailsComponent', () => {
  let component: HumiditydeviceDetailsComponent;
  let fixture: ComponentFixture<HumiditydeviceDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HumiditydeviceDetailsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HumiditydeviceDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
