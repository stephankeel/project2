/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {SingleBlindsComponent} from './single-blinds.component';

describe('SingleBlindsComponent', () => {
  let component: SingleBlindsComponent;
  let fixture: ComponentFixture<SingleBlindsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SingleBlindsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleBlindsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
