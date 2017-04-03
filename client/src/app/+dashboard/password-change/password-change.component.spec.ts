import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PasswordChangeComponent} from './password-change.component';
import {ActivatedRoute, Router} from '@angular/router';
import {MaterialModule} from '@angular/material';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ValidatorsModule} from 'ng2-validators';
import {PasswordChangeRestService} from '../../remote/password-change-rest.service';
import {NotificationService} from '../../notification/notification.service';
import {AuthenticationService} from '../../remote/authentication.service';
import {By} from '@angular/platform-browser';
import {ReplaySubject} from 'rxjs/ReplaySubject';
import {TestingMocksModule} from '../../testing-mocks/testing-mocks.module';

describe('PasswordChangeComponent', () => {
  let component: PasswordChangeComponent;
  let fixture: ComponentFixture<PasswordChangeComponent>;

  let routerSpy: Router;
  let authenticationServiceSpy: AuthenticationService;
  let notificationServiceSpy: NotificationService;
  let passwordChangeRestServiceSpy: PasswordChangeRestService;

  let loginCheckSubject: ReplaySubject<boolean>;
  let passwordUpdateSubject: ReplaySubject<boolean>;

  beforeEach(async(() => {

    loginCheckSubject = new ReplaySubject<boolean>(1);
    passwordUpdateSubject = new ReplaySubject<boolean>(1);

    authenticationServiceSpy = jasmine.createSpyObj<AuthenticationService>('AuthService', ['loginCheckonly', 'getLoggedInUsername']);
    (<jasmine.Spy>authenticationServiceSpy.loginCheckonly).and.returnValue(loginCheckSubject);
    notificationServiceSpy = jasmine.createSpyObj<NotificationService>('NotificationService', ['info']);
    routerSpy = jasmine.createSpyObj<Router>('Router', ['navigate']);
    passwordChangeRestServiceSpy = jasmine.createSpyObj<PasswordChangeRestService>('PasswordChangeService', ['update']);
    (<jasmine.Spy>passwordChangeRestServiceSpy.update).and.returnValue(passwordUpdateSubject);

    TestBed.configureTestingModule({
      imports: [
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
        ValidatorsModule,
        TestingMocksModule,
      ],
      declarations: [
        PasswordChangeComponent,
      ],
      providers: [
        {provide: AuthenticationService, useValue: authenticationServiceSpy},
        {provide: NotificationService, useValue: notificationServiceSpy},
        {provide: Router, useValue: routerSpy},
        {provide: ActivatedRoute, useValue: null},
        {provide: PasswordChangeRestService, useValue: passwordChangeRestServiceSpy},
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordChangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('check appListHeader fields', () => {
    const appListHeader = fixture.debugElement.children[0].children[0];
    expect(appListHeader.context.title).toBe('Passwort ändern');
    expect(appListHeader.context.backlink).toBeUndefined();
    expect(appListHeader.context.showBack).toBeTruthy();
    expect(appListHeader.context.showCreate).toBeUndefined();
    expect(appListHeader.context.disableCreate).toBeUndefined();
    expect(appListHeader.context.showShowAll).toBeUndefined();
  });

  it('should update password', () => {
    const currentPwd = fixture.debugElement.query(By.css('input[name=currentPassword]')).nativeElement;
    const newPwd = fixture.debugElement.query(By.css('input[name=password]')).nativeElement;
    const confirmedPwd = fixture.debugElement.query(By.css('input[name=confirmPassword]')).nativeElement;
    const form = fixture.debugElement.query(By.css('.form'));

    currentPwd.value = '12345678';
    newPwd.value = '12345678';
    confirmedPwd.value = '12345678';
    form.triggerEventHandler('submit', null);

    loginCheckSubject.next(true);
    passwordUpdateSubject.next(false);

    expect(routerSpy.navigate).toHaveBeenCalledWith(['../password-confirmation'], {relativeTo: null});
  });

  it('should update password failed, interal server error', () => {
    const currentPwd = fixture.debugElement.query(By.css('input[name=currentPassword]')).nativeElement;
    const newPwd = fixture.debugElement.query(By.css('input[name=password]')).nativeElement;
    const confirmedPwd = fixture.debugElement.query(By.css('input[name=confirmPassword]')).nativeElement;
    const form = fixture.debugElement.query(By.css('.form'));

    currentPwd.value = '12345678';
    newPwd.value = '12345678';
    confirmedPwd.value = '12345678';
    form.triggerEventHandler('submit', null);

    loginCheckSubject.next(false);

    expect(notificationServiceSpy.info).toHaveBeenCalledTimes(1);
  });

  it('should update password failed, current password not ok', () => {
    const currentPwd = fixture.debugElement.query(By.css('input[name=currentPassword]')).nativeElement;
    const newPwd = fixture.debugElement.query(By.css('input[name=password]')).nativeElement;
    const confirmedPwd = fixture.debugElement.query(By.css('input[name=confirmPassword]')).nativeElement;
    const form = fixture.debugElement.query(By.css('.form'));

    currentPwd.value = '12345678';
    newPwd.value = '12345678';
    confirmedPwd.value = '12345678';
    form.triggerEventHandler('submit', null);

    loginCheckSubject.error(false);

    expect(notificationServiceSpy.info).toHaveBeenCalledTimes(1);
  });

  it('should update password failed', () => {
    const currentPwd = fixture.debugElement.query(By.css('input[name=currentPassword]')).nativeElement;
    const newPwd = fixture.debugElement.query(By.css('input[name=password]')).nativeElement;
    const confirmedPwd = fixture.debugElement.query(By.css('input[name=confirmPassword]')).nativeElement;
    const form = fixture.debugElement.query(By.css('.form'));

    currentPwd.value = '12345678';
    newPwd.value = '12345678';
    confirmedPwd.value = '12345678';
    form.triggerEventHandler('submit', null);

    loginCheckSubject.next(true);
    passwordUpdateSubject.error(false);

    expect(notificationServiceSpy.info).toHaveBeenCalledTimes(1);
  });
});
