import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HumiditySetupOverviewComponent } from './humidity-setup-overview.component';

describe('HumiditySetupOverviewComponent', () => {
  let component: HumiditySetupOverviewComponent;
  let fixture: ComponentFixture<HumiditySetupOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HumiditySetupOverviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HumiditySetupOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
