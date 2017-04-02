import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {BlindsComponent} from './blinds.component';
import {Component} from '@angular/core';

describe('BlindsComponent', () => {
  let component: BlindsComponent;
  let fixture: ComponentFixture<BlindsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        BlindsComponent,
        MockRouterComponent,
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlindsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should contain router-outlet', () => {
    const routerOutlet = fixture.debugElement.children[0];
    expect(routerOutlet.name).toBe('router-outlet');
  });
});

@Component({
  selector: 'router-outlet',
  template: '<div></div>',
})
class MockRouterComponent {
}
