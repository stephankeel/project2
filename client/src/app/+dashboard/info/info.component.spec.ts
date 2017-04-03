import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {InfoComponent} from './info.component';
import {ActivatedRoute, Router} from '@angular/router';
import {CommonRestService} from '../../remote/common-rest.service';
import {Observable} from 'rxjs/Observable';
import {TestingMocksModule} from '../../testing-mocks/testing-mocks.module';

describe('InfoComponent', () => {
  let component: InfoComponent;
  let fixture: ComponentFixture<InfoComponent>;

  let routerSpy: Router;
  let commonRestSpy: CommonRestService;

  beforeEach(async(() => {

    routerSpy = jasmine.createSpyObj<Router>('Router', ['navigate']);
    commonRestSpy = jasmine.createSpyObj<CommonRestService>('CommonRestService', ['getInfo']);
    (<jasmine.Spy>commonRestSpy.getInfo).and.returnValue(Observable.create(observer => {
      observer.next({
        title: 'title',
        nodeVersion: '1',
        cpus: [{model: 'cpuModel'}],
        totalMem: '1000000000',
        freeMem: '1000000'
      });
      observer.next({
        title: 'title',
        nodeVersion: '1',
        cpus: [{model: 'cpuModel'}],
        totalMem: '100',
        freeMem: '100000'
      });
    }));

    TestBed.configureTestingModule({
      imports: [
        TestingMocksModule,
      ],
      declarations: [
        InfoComponent,
      ],
      providers: [
        {provide: Router, useValue: routerSpy},
        {provide: ActivatedRoute, useValue: null},
        {provide: CommonRestService, useValue: commonRestSpy},
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('check appListHeader fields', () => {
    const appListHeader = fixture.debugElement.children[0];
    expect(appListHeader.context.title).toBe('INFORMATION');
    expect(appListHeader.context.backlink).toBe('/dashboard');
    expect(appListHeader.context.showBack).toBeTruthy();
    expect(appListHeader.context.showCreate).toBeUndefined();
    expect(appListHeader.context.disableCreate).toBeUndefined();
    expect(appListHeader.context.showShowAll).toBeUndefined();
  });

});
