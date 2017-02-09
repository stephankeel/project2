import {Component, OnInit, Input} from '@angular/core';
import {ITemperatureDevice} from "../../../../server/entities/device.interface";
import {AuthHttp} from "angular2-jwt";
import {ClientSocketService} from "../remote/client-socket.service";
import {Router} from "@angular/router";
import {GenericDataService} from "../remote/generic-data.service";
import {ITemperatureData} from "../../../../server/entities/data.interface";
import {Observable} from "rxjs";

@Component({
  selector: 'app-temperature-view',
  templateUrl: './temperature-view.component.html',
  styleUrls: ['./temperature-view.component.scss']
})
export class TemperatureViewComponent implements OnInit {

  @Input() private temperatureDevice: ITemperatureDevice;
  private temperatureDataService: GenericDataService<ITemperatureData>;
  private lastItem: Observable<number>;

  constructor(private router: Router, private socketService: ClientSocketService, private authHttp: AuthHttp) {
  }

  ngOnInit() {
    this.temperatureDataService = new GenericDataService<ITemperatureData>(this.authHttp, this.socketService,
      '/api/data/temperature', '/temperature', this.temperatureDevice.id);
    this.lastItem = this.temperatureDataService.lastItem.map(i => i.value);
    this.temperatureDataService.getAll();
    this.temperatureDataService.getLatest();
  }
}
