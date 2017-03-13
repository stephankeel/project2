import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemperatureOverviewComponent } from './temperature-overview.component';

describe('TemperatureOverviewComponent', () => {
  let component: TemperatureOverviewComponent;
  let fixture: ComponentFixture<TemperatureOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TemperatureOverviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemperatureOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
