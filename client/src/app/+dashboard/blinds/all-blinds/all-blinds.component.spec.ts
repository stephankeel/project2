import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AllBlindsComponent} from './all-blinds.component';
import {ActivatedRoute, Router} from '@angular/router';
import {NotEmptyArrayPipe} from '../../analog-devices/pipes/not-empty-array.pipe';
import {GenericeCacheService} from '../../../cache/service/generic.cache.service';
import {GenericDataCacheService} from '../../../cache/service/generic-data-cache.service';
import {BlindsDeviceCacheService} from '../../../cache/service/blinds-device.cache.service';
import {BlindDataCacheService} from '../../../cache/service/blinds-data.cache.service';
import {IDevice} from '../../../../../../server/entities/device.interface';
import {IBlindsData} from '../../../../../../server/entities/data.interface';
import {ReplaySubject} from 'rxjs/ReplaySubject';
import {BlindsState} from '../../../../../../server/entities/blinds-state';
import {By} from '@angular/platform-browser';
import {TestingMocksModule} from '../../../testing-mocks/testing-mocks.module';

describe('AllBlindsComponent', () => {
  let component: AllBlindsComponent;
  let fixture: ComponentFixture<AllBlindsComponent>;

  let routerSpy: Router;
  let getAllSubject: ReplaySubject<IDevice>;
  let getLatestSubject: ReplaySubject<IBlindsData>;

  let device: IDevice;
  let data: IBlindsData;

  beforeEach(async(() => {
    routerSpy = jasmine.createSpyObj<Router>('Router', ['navigate']);

    device = {name: 'b1', id: 1};
    getAllSubject = new ReplaySubject<IDevice>(1);
    getAllSubject.next([device]);

    data = {timestamp: 1, deviceId: 1, percentageDown: 20, state: BlindsState.OPENING};
    getLatestSubject = new ReplaySubject<IBlindsData>(1);
    getLatestSubject.next(data);

    const deviceCacheServiceSpy = jasmine.createSpyObj<GenericeCacheService<IDevice>>('DeviceCache', ['getAll']);
    (<jasmine.Spy>deviceCacheServiceSpy.getAll).and.returnValue(getAllSubject);
    const dataCacheServiceSpy = jasmine.createSpyObj<GenericDataCacheService<IBlindsData, IDevice>>('DataCache', ['getLatestData']);
    (<jasmine.Spy>dataCacheServiceSpy.getLatestData).and.returnValue(getLatestSubject);

    TestBed.configureTestingModule({
      imports: [
        TestingMocksModule,
      ],
      declarations: [
        AllBlindsComponent,
        NotEmptyArrayPipe,
      ],
      providers: [
        {provide: BlindsDeviceCacheService, useValue: deviceCacheServiceSpy},
        {provide: BlindDataCacheService, useValue: dataCacheServiceSpy},
        {provide: Router, useValue: routerSpy},
        {provide: ActivatedRoute, useValue: null},
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllBlindsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('check appListHeader fields', () => {
    const appListHeader = fixture.debugElement.children[0];
    expect(appListHeader.context.title).toBe('Rollladen-Steuerung (alle)');
    expect(appListHeader.context.backlink).toBe('/dashboard');
    expect(appListHeader.context.showBack).toBeTruthy();
    expect(appListHeader.context.showCreate).toBeUndefined();
    expect(appListHeader.context.disableCreate).toBeUndefined();
    expect(appListHeader.context.showShowAll).toBeUndefined();
  });

  it('should execute select when clicked', () => {
    const firstActionButton = fixture.debugElement.query(By.css('.action--button'));
    firstActionButton.triggerEventHandler('click', null);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['../blinds', device.id], {relativeTo: null});
  });

  it('check first app-moving-blinds component content', () => {
    const firstAppMovingBlinds = fixture.debugElement.query(By.css('.app-moving-blinds'));
    expect(firstAppMovingBlinds.context.percentageDown).toBe(data.percentageDown);
    expect(firstAppMovingBlinds.context.name).toBe(device.name);
  });
});
