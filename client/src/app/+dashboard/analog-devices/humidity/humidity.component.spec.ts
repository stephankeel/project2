import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {HumidityComponent} from './humidity.component';
import {TestingMocksModule} from '../../../testing-mocks/testing-mocks.module';

describe('HumidityComponent', () => {
  let component: HumidityComponent;
  let fixture: ComponentFixture<HumidityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        TestingMocksModule,
      ],
      declarations: [
        HumidityComponent,
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

