import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TemperatureSetupOverviewComponent} from './temperature-setup-overview.component';

describe('TemperatureSetupOverviewComponent', () => {
  let component: TemperatureSetupOverviewComponent;
  let fixture: ComponentFixture<TemperatureSetupOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TemperatureSetupOverviewComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemperatureSetupOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
