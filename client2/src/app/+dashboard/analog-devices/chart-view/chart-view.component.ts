import {Component, OnInit, Input} from '@angular/core';
import {Observable, Subscription} from 'rxjs';
import {IAnalogData} from '../../../../../../server/entities/data.interface';

@Component({
  selector: 'app-chart-view',
  templateUrl: './chart-view.component.html',
  styleUrls: ['./chart-view.component.scss']
})
export class ChartViewComponent implements OnInit {

  @Input() deviceDataHistory: Observable<IAnalogData>;

  dataSubscription: Subscription;
  data: any = [];

  constructor() {
  }

  ngOnInit() {
    this.data = {
      labels: [],
      datasets: [
        {
          label: 'Temperature',
          data: []
        }
      ],
      options: {
        scales: {
          xAxes: [{
            time: {
              unit: 'day'
            }
          }]
        }
      }
    }
    this.dataSubscription = this.deviceDataHistory.subscribe((analogData: IAnalogData[]) => {
      analogData.forEach(ad => {
        this.data.labels.push(`${new Date(ad.timestamp).toLocaleDateString()}`);
        this.data.datasets[0].data.push(ad.value);
      });
    });
  }

  ngOnDestroy() {
    this.dataSubscription.unsubscribe();
    this.data = [];
  }
}
