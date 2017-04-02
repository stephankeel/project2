import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TemperatureComponent} from './temperature.component';
import {Component} from '@angular/core';

describe('TemperatureComponent', () => {
  let component: TemperatureComponent;
  let fixture: ComponentFixture<TemperatureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        TemperatureComponent,
        MockRouterComponent,
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemperatureComponent);
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
