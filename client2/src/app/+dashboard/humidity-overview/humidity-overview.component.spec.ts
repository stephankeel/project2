import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HumidityOverviewComponent } from './humidity-overview.component';

describe('HumidityOverviewComponent', () => {
  let component: HumidityOverviewComponent;
  let fixture: ComponentFixture<HumidityOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HumidityOverviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HumidityOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
