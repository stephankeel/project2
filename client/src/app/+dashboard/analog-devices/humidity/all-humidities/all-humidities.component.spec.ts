import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllHumiditiesComponent } from './all-humidities.component';

describe('AllHumiditiesComponent', () => {
  let component: AllHumiditiesComponent;
  let fixture: ComponentFixture<AllHumiditiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllHumiditiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllHumiditiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
