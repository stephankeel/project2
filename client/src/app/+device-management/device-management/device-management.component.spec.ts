import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DeviceManagementComponent} from './device-management.component';
import {Component, Input} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

describe('DeviceManagementComponent', () => {
  let component: DeviceManagementComponent;
  let fixture: ComponentFixture<DeviceManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        DeviceManagementComponent,
        MockListHeaderComponent,
        MockDeviceOverviewComponent,
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

@Component({
  selector: 'app-list-header',
  template: '',
})
class MockListHeaderComponent {
  @Input() title: string;
  @Input() backlink: string;
  @Input() showBack: boolean;
  @Input() showCreate: boolean;
  @Input() disableCreate: boolean;
  @Input() showShowAll: boolean;
}

@Component({
  selector: 'app-device-overview',
  template: '',
})
class MockDeviceOverviewComponent {
}
