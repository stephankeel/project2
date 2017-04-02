import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {BlindsButtonsComponent} from './blinds-buttons.component';
import {NotificationService} from '../../../notification/notification.service';
import {BlindsCommandService} from '../../../remote/blinds-command.service';
import {By} from '@angular/platform-browser';
import {BlindsAction} from '../../../../../../server/entities/blinds-action';
import {ReplaySubject} from 'rxjs/ReplaySubject';

describe('BlindsButtonsComponent', () => {
  let component: BlindsButtonsComponent;
  let fixture: ComponentFixture<BlindsButtonsComponent>;

  let notificationServiceSpy: NotificationService;
  let blindsCommandServiceSpy: BlindsCommandService;

  beforeEach(async(() => {

    notificationServiceSpy = jasmine.createSpyObj<NotificationService>('NotificationService', ['error']);
    blindsCommandServiceSpy = jasmine.createSpyObj<BlindsCommandService>('BlindsCommandService', ['command']);

    TestBed.configureTestingModule({
      declarations: [BlindsButtonsComponent],
      providers: [
        {provide: NotificationService, useValue: notificationServiceSpy},
        {provide: BlindsCommandService, useValue: blindsCommandServiceSpy},
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlindsButtonsComponent);
    component = fixture.componentInstance;
    component.deviceId = '1';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should execute keyUpAction when clicked', () => {
    const subject = new ReplaySubject<boolean>(1);
    subject.next(true);
    (<jasmine.Spy>blindsCommandServiceSpy.command).and.returnValue(subject);

    const keyUpImage = fixture.debugElement.query(By.css('.app-blinds-button-up'));
    keyUpImage.triggerEventHandler('click', null);

    expect(blindsCommandServiceSpy.command).toHaveBeenCalledWith({id: '1', action: BlindsAction.OPEN});
    expect(notificationServiceSpy.error).toHaveBeenCalledTimes(0);
  });

  it('should execute keyUpAction and notif error when clicked', () => {
    const subject = new ReplaySubject<boolean>(1);
    subject.error(true);
    (<jasmine.Spy>blindsCommandServiceSpy.command).and.returnValue(subject);

    const keyUpImage = fixture.debugElement.query(By.css('.app-blinds-button-up'));
    keyUpImage.triggerEventHandler('click', null);

    expect(blindsCommandServiceSpy.command).toHaveBeenCalledWith({id: '1', action: BlindsAction.OPEN});
    expect(notificationServiceSpy.error).toHaveBeenCalled();
  });

  it('should execute keyDownAction when clicked', () => {
    const subject = new ReplaySubject<boolean>(1);
    subject.next(true);
    (<jasmine.Spy>blindsCommandServiceSpy.command).and.returnValue(subject);

    const keyDownImage = fixture.debugElement.query(By.css('.app-blinds-button-down'));
    keyDownImage.triggerEventHandler('click', null);

    expect(blindsCommandServiceSpy.command).toHaveBeenCalledWith({id: '1', action: BlindsAction.CLOSE});
    expect(notificationServiceSpy.error).toHaveBeenCalledTimes(0);
  });

  it('should execute keyDownAction and notif error when clicked', () => {
    const subject = new ReplaySubject<boolean>(1);
    subject.error(true);
    (<jasmine.Spy>blindsCommandServiceSpy.command).and.returnValue(subject);

    const keyDownImage = fixture.debugElement.query(By.css('.app-blinds-button-down'));
    keyDownImage.triggerEventHandler('click', null);

    expect(blindsCommandServiceSpy.command).toHaveBeenCalledWith({id: '1', action: BlindsAction.CLOSE});
    expect(notificationServiceSpy.error).toHaveBeenCalled();
  });

  it('should execute keyStopAction when clicked', () => {
    const subject = new ReplaySubject<boolean>(1);
    subject.next(true);
    (<jasmine.Spy>blindsCommandServiceSpy.command).and.returnValue(subject);

    const keyStopImage = fixture.debugElement.query(By.css('.app-blinds-button-stop'));
    keyStopImage.triggerEventHandler('click', null);

    expect(blindsCommandServiceSpy.command).toHaveBeenCalledWith({id: '1', action: BlindsAction.STOP});
    expect(notificationServiceSpy.error).toHaveBeenCalledTimes(0);
  });

  it('should execute keyStopAction and notif error when clicked', () => {
    const subject = new ReplaySubject<boolean>(1);
    subject.error(true);
    (<jasmine.Spy>blindsCommandServiceSpy.command).and.returnValue(subject);

    const keyStopImage = fixture.debugElement.query(By.css('.app-blinds-button-stop'));
    keyStopImage.triggerEventHandler('click', null);

    expect(blindsCommandServiceSpy.command).toHaveBeenCalledWith({id: '1', action: BlindsAction.STOP});
    expect(notificationServiceSpy.error).toHaveBeenCalled();
  });
});
