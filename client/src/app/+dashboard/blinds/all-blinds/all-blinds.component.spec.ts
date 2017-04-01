import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AllBlindsComponent} from './all-blinds.component';

describe('AllBlindsComponent', () => {
  let component: AllBlindsComponent;
  let fixture: ComponentFixture<AllBlindsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllBlindsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllBlindsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
