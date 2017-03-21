import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllOfTypeComponent } from './all-of-type.component';

describe('AllOfTypeComponent', () => {
  let component: AllOfTypeComponent;
  let fixture: ComponentFixture<AllOfTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllOfTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllOfTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
