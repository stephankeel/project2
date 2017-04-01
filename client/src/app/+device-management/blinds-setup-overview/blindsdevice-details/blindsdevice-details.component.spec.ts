import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {BlindsdeviceDetailsComponent} from './blindsdevice-details.component';

describe('BlindsdeviceDetailsComponent', () => {
  let component: BlindsdeviceDetailsComponent;
  let fixture: ComponentFixture<BlindsdeviceDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BlindsdeviceDetailsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlindsdeviceDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
