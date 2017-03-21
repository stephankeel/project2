import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HumiditydeviceDeleteComponent } from './humiditydevice-delete.component';

describe('HumiditydeviceDeleteComponent', () => {
  let component: HumiditydeviceDeleteComponent;
  let fixture: ComponentFixture<HumiditydeviceDeleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HumiditydeviceDeleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HumiditydeviceDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
