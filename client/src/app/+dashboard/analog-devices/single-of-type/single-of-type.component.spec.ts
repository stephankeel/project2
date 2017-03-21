import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleOfTypeComponent } from './single-of-type.component';

describe('SingleOfTypeComponent', () => {
  let component: SingleOfTypeComponent;
  let fixture: ComponentFixture<SingleOfTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SingleOfTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleOfTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
