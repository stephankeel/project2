import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {SingleHumidityComponent} from './single-humidity.component';

describe('SingleHumidityComponent', () => {
  let component: SingleHumidityComponent;
  let fixture: ComponentFixture<SingleHumidityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SingleHumidityComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleHumidityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
