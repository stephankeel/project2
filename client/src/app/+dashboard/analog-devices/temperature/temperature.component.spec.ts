import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TemperatureComponent} from './temperature.component';
import {TestingMocksModule} from '../../../testing-mocks/testing-mocks.module';

describe('TemperatureComponent', () => {
  let component: TemperatureComponent;
  let fixture: ComponentFixture<TemperatureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        TestingMocksModule,
      ],
      declarations: [
        TemperatureComponent,
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
