import {async, TestBed} from '@angular/core/testing';

import {AppComponent} from './app.component';
import {NotificationService} from "./notification/notification.service";
import {Component, Input} from "@angular/core";

describe('AppComponent', () => {
  let notificationServiceSpy: NotificationService;
  beforeEach(async(() => {
    notificationServiceSpy = jasmine.createSpyObj<NotificationService>('NotificationService', ['clear','message']);
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        MockRouterComponent,
        MockPGrowlComponent,
      ],
      providers: [
        {provide: NotificationService, useValue: notificationServiceSpy},
      ]
    }).compileComponents();
  }));

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it('should return all messages', async(() => {
    notificationServiceSpy.message = [];
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.getMessages().length).toBe(0);
  }));

  it('should clear all messages', async(() => {
    notificationServiceSpy.message = [];
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    app.clearMessage();
    expect(notificationServiceSpy.clear).toHaveBeenCalledTimes(1);
  }));
});

@Component({
  selector: 'router-outlet',
  template: '',
})
class MockRouterComponent {
}
@Component({
  selector: 'p-growl',
  template: '',
})
class MockPGrowlComponent {
  @Input() life : number;
  @Input() value: any;
}
