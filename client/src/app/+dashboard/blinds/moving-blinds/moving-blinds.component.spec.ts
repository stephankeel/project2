import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {DebugElement} from '@angular/core';

import {MovingBlindsComponent} from './moving-blinds.component';

describe('MovingBlindsComponent', () => {
  let component: MovingBlindsComponent;
  let fixture: ComponentFixture<MovingBlindsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MovingBlindsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MovingBlindsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('test attributes', () => {
    component.name = "name1";
    component.percentageDown = 10;
    expect(component.name).toEqual("name1");
    expect(component.percentageDown).toEqual(10);
  });
});
