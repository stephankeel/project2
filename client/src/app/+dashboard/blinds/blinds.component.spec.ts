import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {BlindsComponent} from './blinds.component';
import {TestingMocksModule} from '../../testing-mocks/testing-mocks.module';

describe('BlindsComponent', () => {
  let component: BlindsComponent;
  let fixture: ComponentFixture<BlindsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        TestingMocksModule,
      ],
      declarations: [
        BlindsComponent,
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
