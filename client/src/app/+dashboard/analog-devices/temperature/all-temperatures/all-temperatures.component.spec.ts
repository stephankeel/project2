import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AllTemperaturesComponent} from './all-temperatures.component';

describe('AllTemperaturesComponent', () => {
  let component: AllTemperaturesComponent;
  let fixture: ComponentFixture<AllTemperaturesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AllTemperaturesComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllTemperaturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
