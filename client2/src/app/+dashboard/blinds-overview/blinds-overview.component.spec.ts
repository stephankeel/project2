import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlindsOverviewComponent } from './blinds-overview.component';

describe('BlindsOverviewComponent', () => {
  let component: BlindsOverviewComponent;
  let fixture: ComponentFixture<BlindsOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlindsOverviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlindsOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
