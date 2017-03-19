import {Component, OnInit, Input, ViewChild} from '@angular/core';
import {Observable, Subscription} from 'rxjs';
import {IAnalogData} from '../../../../../../server/entities/data.interface';
import {UIChart} from 'primeng/components/chart/chart';

@Component({
  selector: 'app-chart-view',
  templateUrl: './chart-view.component.html',
  styleUrls: ['./chart-view.component.scss']
})
export class ChartViewComponent implements OnInit {

  @ViewChild('chart') chart: UIChart;
  @Input() deviceDataHistory: Observable<IAnalogData>;

  dataSubscription: Subscription;
  data: any;

  constructor() {
    this.data = {
      labels: [],
      datasets: [
        {
          label: 'Temperature',
          data: []
        }
      ],
    }
  }

  ngOnInit() {
    this.dataSubscription = this.deviceDataHistory.subscribe((analogData: IAnalogData[]) => this.setData(analogData));
  }

  ngOnDestroy() {
    this.dataSubscription.unsubscribe();
  }

  setData(analogData: IAnalogData[]): void {
    this.data.labels = [];
    this.data.datasets[0].data = [];
    analogData.forEach(ad => {
      this.data.labels.push(`${new Date(ad.timestamp).toLocaleTimeString()}`);
      this.data.datasets[0].data.push(ad.value);
    });
    this.chart.refresh();
  }

}
