import {Component, OnInit, Input, ViewChild} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';
import {IAnalogData} from '../../../../../../server/entities/data.interface';
import {UIChart} from 'primeng/components/chart/chart';

@Component({
  selector: 'app-chart-view',
  templateUrl: './chart-view.component.html',
  styleUrls: ['./chart-view.component.scss']
})
export class ChartViewComponent implements OnInit {

  static readonly MAX_RECORDS = 100;

  @ViewChild('chart') chart: UIChart;
  @Input() deviceDataHistory: Observable<IAnalogData[]>;
  @Input() label: string;

  dataSubscription: Subscription;
  data: any;

  constructor() {
    this.data = {
      labels: [],
      datasets: [
        {
          label: '',
          data: []
        }
      ],
    };
  }

  ngOnInit() {
    this.dataSubscription = this.deviceDataHistory.subscribe((analogData: IAnalogData[]) => this.setData(analogData));
  }

  ngOnDestroy() {
    this.dataSubscription.unsubscribe();
  }

  setData(analogData: IAnalogData[]): void {
    this.data.labels = [];
    this.data.datasets[0].label = this.label;
    this.data.datasets[0].data = [];
    const reducedDataArray: IAnalogData[] = this.reduceData(analogData);
    reducedDataArray.forEach(ad => {
      this.data.labels.push(`${new Date(ad.timestamp).toLocaleTimeString()}`);
      this.data.datasets[0].data.push(ad.value);
    });
    this.chart.refresh();
  }

  reduceData(data: IAnalogData[]): IAnalogData[] {
    if (data.length <= ChartViewComponent.MAX_RECORDS) {
      return data;
    }
    const reducedData: IAnalogData[] = [];
    const numberToDelete: number = data.length - ChartViewComponent.MAX_RECORDS;
    if (numberToDelete > ChartViewComponent.MAX_RECORDS) {
      // keep every n-th element
      const nthElement: number = Math.round(data.length / ChartViewComponent.MAX_RECORDS);
      let i = 0;
      data.forEach(d => {
        if (i % nthElement === 0) {
          reducedData.push(d);
        }
        i++;
      });
    } else {
      // drop every n-th element
      const nthElement: number = Math.round(ChartViewComponent.MAX_RECORDS / numberToDelete) + 1;
      let i = 0;
      data.forEach(d => {
        i++;
        if (i % nthElement !== 0) {
          reducedData.push(d);
        }
      });
    }
    return reducedData;
  }

}
