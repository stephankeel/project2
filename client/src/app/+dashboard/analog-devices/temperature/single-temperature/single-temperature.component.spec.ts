import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {SingleTemperatureComponent} from './single-temperature.component';

describe('SingleTemperatureComponent', () => {
  let component: SingleTemperatureComponent;
  let fixture: ComponentFixture<SingleTemperatureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SingleTemperatureComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleTemperatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
