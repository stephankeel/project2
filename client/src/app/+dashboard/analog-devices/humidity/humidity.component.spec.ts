import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {HumidityComponent} from './humidity.component';
import {Component, Input} from '@angular/core';

describe('HumidityComponent', () => {
  let component: HumidityComponent;
  let fixture: ComponentFixture<HumidityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        HumidityComponent,
        MockRouterComponent,
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HumidityComponent);
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
