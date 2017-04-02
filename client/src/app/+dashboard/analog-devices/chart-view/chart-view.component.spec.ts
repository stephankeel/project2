import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ChartViewComponent} from './chart-view.component';
import {Component, Input} from '@angular/core';
import {ReplaySubject} from 'rxjs/ReplaySubject';
import {IAnalogData} from '../../../../../../server/entities/data.interface';

describe('ChartViewComponent', () => {
  let component: ChartViewComponent;
  let fixture: ComponentFixture<ChartViewComponent>;

  const data = new ReplaySubject<IAnalogData[]>(1);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ChartViewComponent,
        MockPChartComponent,
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartViewComponent);
    component = fixture.componentInstance;
    component.deviceDataHistory = data;
    fixture.detectChanges();
  });

  it('should create', () => {
    data.next(createData(1));

    expect(component).toBeTruthy();
  });

  it('check chart type', () => {
    data.next(createData(1));

    const pChart = fixture.debugElement.children[0];
    expect(pChart.context.type).toBe('line');
  });

  it('check dataset length 1', () => {
    data.next(createData(1));

    const pChart = fixture.debugElement.children[0];
    expect(pChart.context.data.datasets[0].data.length).toBe(1);
  });

  it(`check dataset length MAX_RECORDS-1 (${ChartViewComponent.MAX_RECORDS - 1})`, () => {
    data.next(createData(ChartViewComponent.MAX_RECORDS - 1));

    const pChart = fixture.debugElement.children[0];
    expect(pChart.context.data.datasets[0].data.length).toBe(ChartViewComponent.MAX_RECORDS - 1);
  });

  it(`check dataset length MAX_RECORDS (${ChartViewComponent.MAX_RECORDS})`, () => {
    data.next(createData(ChartViewComponent.MAX_RECORDS));

    const pChart = fixture.debugElement.children[0];
    expect(pChart.context.data.datasets[0].data.length).toBe(ChartViewComponent.MAX_RECORDS);
  });

  it(`check dataset length MAX_RECORDS + 1 (${ChartViewComponent.MAX_RECORDS + 1})`, () => {
    data.next(createData(ChartViewComponent.MAX_RECORDS + 1));

    const pChart = fixture.debugElement.children[0];
    expect(pChart.context.data.datasets[0].data.length).toBe(ChartViewComponent.MAX_RECORDS);
  });

  it(`check dataset length 2x MAX_RECORDS (${ChartViewComponent.MAX_RECORDS * 2})`, () => {
    data.next(createData(ChartViewComponent.MAX_RECORDS * 2));

    const pChart = fixture.debugElement.children[0];
    expect(pChart.context.data.datasets[0].data.length).toBe(ChartViewComponent.MAX_RECORDS);
  });

  it(`check dataset length 2x MAX_RECORDS + 8 (${ChartViewComponent.MAX_RECORDS * 2 + 8})`, () => {
    data.next(createData(ChartViewComponent.MAX_RECORDS * 2 + 8));

    const pChart = fixture.debugElement.children[0];
    expect(pChart.context.data.datasets[0].data.length).toBe(ChartViewComponent.MAX_RECORDS + 4);
  });

  it('check dataset content', () => {
    data.next(createData(ChartViewComponent.MAX_RECORDS * 2 + 8));

    const pChart = fixture.debugElement.children[0];
    expect(pChart.context.data.datasets[0].data[0]).toBe(0);
    expect(pChart.context.data.datasets[0].data[1]).toBe(2);
    expect(pChart.context.data.datasets[0].data[2]).toBe(4);
  });
});

function createData(count: number): IAnalogData[] {
  const result: IAnalogData[] = [];
  for (let i = 0; i < count; i++) {
    result.push({timestamp: i, value: i});
  }
  return result;
}

@Component({
  selector: 'p-chart',
  template: '<div></div>',
})
class MockPChartComponent {
  @Input() type: string;
  @Input() data: any;

  refresh() {
  }
}
