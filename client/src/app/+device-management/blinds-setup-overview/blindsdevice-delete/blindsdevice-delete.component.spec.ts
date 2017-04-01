import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {BlindsdeviceDeleteComponent} from './blindsdevice-delete.component';

describe('BlindsdeviceDeleteComponent', () => {
  let component: BlindsdeviceDeleteComponent;
  let fixture: ComponentFixture<BlindsdeviceDeleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BlindsdeviceDeleteComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlindsdeviceDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
