import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AnalogViewComponent} from './analog-view.component';

describe('AnalogViewComponent', () => {
  let component: AnalogViewComponent;
  let fixture: ComponentFixture<AnalogViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AnalogViewComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalogViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
