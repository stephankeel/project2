import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {BlindsdeviceChangeComponent} from './blindsdevice-change.component';

describe('BlindsdeviceChangeComponent', () => {
  let component: BlindsdeviceChangeComponent;
  let fixture: ComponentFixture<BlindsdeviceChangeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BlindsdeviceChangeComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlindsdeviceChangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
