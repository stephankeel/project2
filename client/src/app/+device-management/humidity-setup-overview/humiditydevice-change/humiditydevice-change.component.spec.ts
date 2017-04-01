import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {HumiditydeviceChangeComponent} from './humiditydevice-change.component';

describe('HumiditydeviceChangeComponent', () => {
  let component: HumiditydeviceChangeComponent;
  let fixture: ComponentFixture<HumiditydeviceChangeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HumiditydeviceChangeComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HumiditydeviceChangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
