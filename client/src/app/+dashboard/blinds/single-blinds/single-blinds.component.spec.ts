import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {SingleBlindsComponent} from './single-blinds.component';
import {BlindsDeviceCacheService} from '../../../cache/service/blinds-device.cache.service';
import {BlindDataCacheService} from '../../../cache/service/blinds-data.cache.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {GenericeCacheService} from '../../../cache/service/generic.cache.service';
import {GenericDataCacheService} from '../../../cache/service/generic-data-cache.service';
import {IBlindsData} from '../../../../../../server/entities/data.interface';
import {IDevice} from '../../../../../../server/entities/device.interface';
import {ReplaySubject} from 'rxjs/ReplaySubject';
import {BlindsState} from '../../../../../../server/entities/blinds-state';
import {By} from '@angular/platform-browser';
import {NotificationService} from '../../../notification/notification.service';
import {TestingMocksModule} from '../../../testing-mocks/testing-mocks.module';

describe('SingleBlindsComponent', () => {
  let component: SingleBlindsComponent;
  let fixture: ComponentFixture<SingleBlindsComponent>;

  let routerSpy: Router;
  let notificationServiceSpy: NotificationService;
  let activatedRouteSpy: any;

  let getAllSubject: ReplaySubject<IDevice>;
  let getDeviceSubject: ReplaySubject<IDevice>;
  let getLatestSubject: ReplaySubject<IBlindsData>;
  let paramsSubject: ReplaySubject<Params>;

  let device: IDevice;
  let data: IBlindsData;

  beforeEach(async(() => {
    routerSpy = jasmine.createSpyObj<Router>('Router', ['navigate']);

    paramsSubject = new ReplaySubject<Params>(1);
    paramsSubject.next({id: 1});

    device = {name: 'b1', id: 1};
    getAllSubject = new ReplaySubject<IDevice>(1);
    getAllSubject.next([device]);

    getDeviceSubject = new ReplaySubject<IDevice>(1);
    getDeviceSubject.next(device);

    data = {timestamp: 1, deviceId: 1, percentageDown: 20, state: BlindsState.OPENING};
    getLatestSubject = new ReplaySubject<IBlindsData>(1);
    getLatestSubject.next(data);

    const deviceCacheServiceSpy = jasmine.createSpyObj<GenericeCacheService<IDevice>>('DeviceCache', ['getAll', 'getDevice']);
    (<jasmine.Spy>deviceCacheServiceSpy.getAll).and.returnValue(getAllSubject);
    (<jasmine.Spy>deviceCacheServiceSpy.getDevice).and.returnValue(getDeviceSubject);
    const dataCacheServiceSpy = jasmine.createSpyObj<GenericDataCacheService<IBlindsData, IDevice>>('DataCache', ['getLatestData']);
    (<jasmine.Spy>dataCacheServiceSpy.getLatestData).and.returnValue(getLatestSubject);
    activatedRouteSpy = {params: paramsSubject};
    notificationServiceSpy = jasmine.createSpyObj<NotificationService>('NotificationService', ['clear']);

    TestBed.configureTestingModule({
      imports: [
        TestingMocksModule,
      ],
      declarations: [
        SingleBlindsComponent,
      ],
      providers: [
        {provide: BlindsDeviceCacheService, useValue: deviceCacheServiceSpy},
        {provide: BlindDataCacheService, useValue: dataCacheServiceSpy},
        {provide: Router, useValue: routerSpy},
        {provide: ActivatedRoute, useValue: activatedRouteSpy},
        {provide: NotificationService, useValue: notificationServiceSpy},
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleBlindsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('check appListHeader fields', () => {
    const appListHeader = fixture.debugElement.children[0];
    expect(appListHeader.context.title).toBe('Rollladen-Steuerung (einzeln)');
    expect(appListHeader.context.showBack).toBeTruthy();
    expect(appListHeader.context.backlink).toBeUndefined();
    expect(appListHeader.context.showCreate).toBeUndefined();
    expect(appListHeader.context.disableCreate).toBeUndefined();
    expect(appListHeader.context.showShowAll).toBeUndefined();
  });

  it('check first app-moving-blinds component content', () => {
    const firstAppMovingBlinds = fixture.debugElement.query(By.css('.app-moving-blinds'));
    expect(firstAppMovingBlinds.context.percentageDown).toBe(data.percentageDown);
    expect(firstAppMovingBlinds.context.name).toBe(device.name);
  });

  it('check first app-blind-buttons component content', () => {
    const firstAppBlindButtons = fixture.debugElement.query(By.css('.app-blinds-buttons'));
    expect(firstAppBlindButtons.context.deviceId).toBe(device.id);
  });

  it('should execute selectDevice when click device', () => {
    const firstActionButton = fixture.debugElement.query(By.css('.action--button'));
    firstActionButton.triggerEventHandler('click', null);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['../', device.id], {relativeTo: activatedRouteSpy});
  });

  it('should redirect back, if deleted', () => {
    const firstActionButton = fixture.debugElement.query(By.css('.action--button'));
    getAllSubject.next([]);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['..'], {relativeTo: activatedRouteSpy});
  });

  it('should unsubscribe dataHistory if param change', () => {
    const firstActionButton = fixture.debugElement.query(By.css('.action--button'));
    paramsSubject.next({id: 2});
    getAllSubject.next([]);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['..'], {relativeTo: activatedRouteSpy});
  });
});
