import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {SingleOfTypeComponent} from './single-of-type.component';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {TemperatureDeviceCacheService} from '../../../cache/service/temperature-device.cache.service';
import {TemperatureDataCacheService} from '../../../cache/service/temperature-data.cache.service';
import {HumidityDeviceCacheService} from '../../../cache/service/humidity-device.cache.service';
import {HumidityDataCacheService} from '../../../cache/service/humidity-data.cache.service';
import {IAnalogData} from '../../../../../../server/entities/data.interface';
import {IDevice} from '../../../../../../server/entities/device.interface';
import {ReplaySubject} from 'rxjs/ReplaySubject';
import {GenericeCacheService} from '../../../cache/service/generic.cache.service';
import {GenericDataCacheService} from '../../../cache/service/generic-data-cache.service';
import {DeviceType} from '../../../../../../server/entities/device-type';
import {MaterialModule} from '@angular/material';
import {NotificationService} from '../../../notification/notification.service';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {By} from '@angular/platform-browser';
import {TestingMocksModule} from '../../../testing-mocks/testing-mocks.module';

describe('SingleOfTypeComponent', () => {
  let component: SingleOfTypeComponent;
  let fixture: ComponentFixture<SingleOfTypeComponent>;

  let routerSpy: Router;
  let notificationServiceSpy: NotificationService;
  let activatedRouteSpy: any;

  let device: IDevice;
  let data: IAnalogData;

  let getAllSubject: ReplaySubject<IDevice>;
  let getLatestSubject: ReplaySubject<IAnalogData>;
  let getAllDataSubject: ReplaySubject<IAnalogData>;
  let paramsSubject: ReplaySubject<Params>;

  beforeEach(async(() => {
    device = {name: 'dev1', id: 1};
    getAllSubject = new ReplaySubject<IDevice>(1);
    getAllSubject.next([device]);

    data = {timestamp: 1, deviceId: 1, value: 11.11};
    getLatestSubject = new ReplaySubject<IAnalogData>(1);
    getLatestSubject.next(data);

    getAllDataSubject = new ReplaySubject<IAnalogData>(1);
    getAllDataSubject.next([data]);

    paramsSubject = new ReplaySubject<Params>(1);
    paramsSubject.next({id: 1});

    const deviceCacheServiceSpy = jasmine.createSpyObj<GenericeCacheService<IDevice>>('DeviceCache', ['getAll', 'getDevice']);
    (<jasmine.Spy>deviceCacheServiceSpy.getAll).and.returnValue(getAllSubject);
    const dataCacheServiceSpy =
      jasmine.createSpyObj<GenericDataCacheService<IAnalogData, IDevice>>('DataCache', ['getLatestData', 'getAllData']);
    (<jasmine.Spy>dataCacheServiceSpy.getLatestData).and.returnValue(getLatestSubject);
    (<jasmine.Spy>dataCacheServiceSpy.getAllData).and.returnValue(getAllDataSubject);
    routerSpy = jasmine.createSpyObj<Router>('Router', ['navigate']);
    notificationServiceSpy = jasmine.createSpyObj<NotificationService>('NotificationService', ['clear']);
    activatedRouteSpy = {params: paramsSubject};


    TestBed.configureTestingModule({
      imports: [
        MaterialModule,
        NoopAnimationsModule,
        TestingMocksModule,
      ],
      declarations: [
        SingleOfTypeComponent,
      ],
      providers: [
        {provide: TemperatureDeviceCacheService, useValue: deviceCacheServiceSpy},
        {provide: TemperatureDataCacheService, useValue: dataCacheServiceSpy},
        {provide: HumidityDeviceCacheService, useValue: deviceCacheServiceSpy},
        {provide: HumidityDataCacheService, useValue: dataCacheServiceSpy},
        {provide: NotificationService, useValue: notificationServiceSpy},
        {provide: Router, useValue: routerSpy},
        {provide: ActivatedRoute, useValue: activatedRouteSpy},
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleOfTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create humidity', () => {
    fixture = TestBed.createComponent(SingleOfTypeComponent);
    component = fixture.componentInstance;
    component.deviceType = DeviceType.HUMIDITY;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should have one device', () => {
    const actionButtons = fixture.debugElement.queryAll(By.css('.action--button'));
    expect(component).toBeTruthy();
    expect(actionButtons.length).toEqual(1);
  });

  it('should execute click device', () => {
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
