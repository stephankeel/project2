import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DeviceManagementComponent} from './device-management.component';
import {TestingMocksModule} from '../../testing-mocks/testing-mocks.module';

describe('DeviceManagementComponent', () => {
  let component: DeviceManagementComponent;
  let fixture: ComponentFixture<DeviceManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        TestingMocksModule,
      ],
      declarations: [
        DeviceManagementComponent,
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('check appListHeader fields', () => {
    const appListHeader = fixture.debugElement.children[0];
    expect(appListHeader.context.title).toBe('Geräteverwaltung');
    expect(appListHeader.context.backlink).toBe('../..');
    expect(appListHeader.context.showBack).toBeTruthy();
    expect(appListHeader.context.showCreate).toBeUndefined();
    expect(appListHeader.context.disableCreate).toBeUndefined();
    expect(appListHeader.context.showShowAll).toBeUndefined();
  });
});
