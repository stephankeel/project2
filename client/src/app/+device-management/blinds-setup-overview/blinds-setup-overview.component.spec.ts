import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlindsSetupOverviewComponent } from './blinds-setup-overview.component';

describe('BlindsSetupOverviewComponent', () => {
  let component: BlindsSetupOverviewComponent;
  let fixture: ComponentFixture<BlindsSetupOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlindsSetupOverviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlindsSetupOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
