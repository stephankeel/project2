import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DashboardComponent} from './dashboard.component';
import {MaterialModule} from '@angular/material';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Component} from '@angular/core';
import {By} from '@angular/platform-browser';
import {AuthenticationService} from '../../remote/authentication.service';
import {ReplaySubject} from 'rxjs/ReplaySubject';


describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  let routerSpy: Router;
  let authenticationServiceSpy: AuthenticationService;
  let activatedRouteSpy: any;

  let paramsSubject: ReplaySubject<Params>;

  beforeEach(async(() => {

    paramsSubject = new ReplaySubject<Params>(1);
    paramsSubject.next({id: 1});

    routerSpy = jasmine.createSpyObj<Router>('Router', ['navigate']);
    authenticationServiceSpy = jasmine.createSpyObj<AuthenticationService>('AuthService', ['loggedIn', 'isAdmin']);
    (<jasmine.Spy>authenticationServiceSpy.loggedIn).and.returnValue(true);
    activatedRouteSpy = {params: paramsSubject};

    TestBed.configureTestingModule({
      imports: [
        MaterialModule,
      ],
      declarations: [
        DashboardComponent,
        MockAppFooterComponent,
        MockRouterComponent,
      ],
      providers: [
        {provide: Router, useValue: routerSpy},
        {provide: ActivatedRoute, useValue: activatedRouteSpy},
        {provide: AuthenticationService, useValue: authenticationServiceSpy},
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should execute home when click on header', () => {
    const headerTitle = fixture.debugElement.query(By.css('.header__title'));
    headerTitle.triggerEventHandler('click', null);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should execute logout when click on logout', () => {
    const logoutLink = fixture.debugElement.query(By.css('.link__logout'));
    logoutLink.triggerEventHandler('click', null);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['../logout'], {relativeTo: activatedRouteSpy});
  });
});

@Component({
  selector: 'app-footer',
  template: '<div></div>',
})
export class MockAppFooterComponent {
}


@Component({
  selector: 'router-outlet',
  template: '<div></div>',
})
class MockRouterComponent {
}
