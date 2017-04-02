import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AllOfTypeComponent} from './all-of-type.component';
import {TemperatureDeviceCacheService} from '../../../cache/service/temperature-device.cache.service';
import {TemperatureDataCacheService} from '../../../cache/service/temperature-data.cache.service';
import {HumidityDeviceCacheService} from '../../../cache/service/humidity-device.cache.service';
import {HumidityDataCacheService} from '../../../cache/service/humidity-data.cache.service';
import {ActivatedRoute, Router} from '@angular/router';
import {IDevice} from '../../../../../../server/entities/device.interface';
import {GenericeCacheService} from '../../../cache/service/generic.cache.service';
import {GenericDataCacheService} from '../../../cache/service/generic-data-cache.service';
import {IAnalogData} from '../../../../../../server/entities/data.interface';
import {Component, Input} from '@angular/core';
import {ReplaySubject} from 'rxjs/ReplaySubject';
import {NotEmptyArrayPipe} from '../pipes/not-empty-array.pipe';
import {DeviceType} from '../../../../../../server/entities/device-type';
import {By} from '@angular/platform-browser';

describe('AllOfTypeComponent', () => {
  let component: AllOfTypeComponent;
  let fixture: ComponentFixture<AllOfTypeComponent>;
  let routerSpy: Router;

  let device: IDevice;
  let data: IAnalogData;

  let getAllSubject: ReplaySubject<IDevice>;
  let getLatestSubject: ReplaySubject<IAnalogData>;

  beforeEach(async(() => {
    device = {name: 'dev1', id: 1};
    getAllSubject = new ReplaySubject<IDevice>(1);
    getAllSubject.next([device]);

    data = {timestamp: 1, deviceId: 1, value: 11.11};
    getLatestSubject = new ReplaySubject<IAnalogData>(1);
    getLatestSubject.next(data);

    const deviceCacheServiceSpy = jasmine.createSpyObj<GenericeCacheService<IDevice>>('DeviceCache', ['getAll']);
    (<jasmine.Spy>deviceCacheServiceSpy.getAll).and.returnValue(getAllSubject);
    const dataCacheServiceSpy = jasmine.createSpyObj<GenericDataCacheService<IAnalogData, IDevice>>('DataCache', ['getLatestData']);
    (<jasmine.Spy>dataCacheServiceSpy.getLatestData).and.returnValue(getLatestSubject);
    routerSpy = jasmine.createSpyObj<Router>('Router', ['navigate']);

    TestBed.configureTestingModule({
      declarations: [
        AllOfTypeComponent,
        MockListHeaderComponent,
        MockAnalogViewComponent,
        NotEmptyArrayPipe,
      ],
      providers: [
        {provide: TemperatureDeviceCacheService, useValue: deviceCacheServiceSpy},
        {provide: TemperatureDataCacheService, useValue: dataCacheServiceSpy},
        {provide: HumidityDeviceCacheService, useValue: deviceCacheServiceSpy},
        {provide: HumidityDataCacheService, useValue: dataCacheServiceSpy},
        {provide: Router, useValue: routerSpy},
        {provide: ActivatedRoute, useValue: null},
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllOfTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create humidity', () => {
    fixture = TestBed.createComponent(AllOfTypeComponent);
    component = fixture.componentInstance;
    component.deviceType = DeviceType.HUMIDITY;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should create temperature', () => {
    expect(component).toBeTruthy();
  });

  it('should have one device', () => {
    const actionButtons = fixture.debugElement.queryAll(By.css('.action--button'));
    expect(component).toBeTruthy();
    expect(actionButtons.length).toEqual(1);
  });

  it('should have two devices', () => {
    getAllSubject.next([device, device]);
    fixture = TestBed.createComponent(AllOfTypeComponent);
    component = fixture.componentInstance;
    component.deviceType = DeviceType.HUMIDITY;
    fixture.detectChanges();
    const actionButtons = fixture.debugElement.queryAll(By.css('.action--button'));
    expect(actionButtons.length).toEqual(2);
  });

  it('should execute click with temperature device', () => {
    const firstActionButton = fixture.debugElement.query(By.css('.action--button'));
    firstActionButton.triggerEventHandler('click', null);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['../temperature', device.id], {relativeTo: null});
  });

  it('should execute click with humidity device', () => {
    fixture = TestBed.createComponent(AllOfTypeComponent);
    component = fixture.componentInstance;
    component.deviceType = DeviceType.HUMIDITY;
    fixture.detectChanges();
    const firstActionButton = fixture.debugElement.query(By.css('.action--button'));
    firstActionButton.triggerEventHandler('click', null);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['../humidity', device.id], {relativeTo: null});
  });

  it('check appListHeader fields', () => {
    const appListHeader = fixture.debugElement.children[0];
    expect(appListHeader.context.title).toBe('Temperatur-Übersicht');
    expect(appListHeader.context.backlink).toBe('/dashboard');
    expect(appListHeader.context.showBack).toBeTruthy();
    expect(appListHeader.context.showCreate).toBeUndefined();
    expect(appListHeader.context.disableCreate).toBeUndefined();
    expect(appListHeader.context.showShowAll).toBeUndefined();
  });

  it('check action button component content', () => {
    const firstActionButton = fixture.debugElement.query(By.css('.action--button'));
    expect(firstActionButton.children[0].context.units).toBe('°C');
    expect(firstActionButton.children[0].context.value).toBe(data.value);
    expect(firstActionButton.children[0].context.name).toBe(device.name);
    expect(firstActionButton.children[0].context.timestamp).toBe(data.timestamp);
  });
});

@Component({
  selector: 'app-list-header',
  template: '<div></div>',
})
class MockListHeaderComponent {
  @Input() title: string;
  @Input() backlink: string;
  @Input() showBack: boolean;
  @Input() showCreate: boolean;
  @Input() disableCreate: boolean;
  @Input() showShowAll: boolean;

  constructor(private router: Router, private route: ActivatedRoute) {
  }
}

@Component({
  selector: 'app-analog-view',
  template: '<div></div>',
})
export class MockAnalogViewComponent {
  @Input() name: string;
  @Input() value: number;
  @Input() units: string;
  @Input() timestamp: number;
}
