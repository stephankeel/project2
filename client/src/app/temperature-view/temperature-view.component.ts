import {Component, OnInit, Input} from '@angular/core';
import {ITemperatureDevice} from "../../../../server/entities/device.interface";
import {AuthHttp} from "angular2-jwt";
import {ClientSocketService} from "../remote/client-socket.service";
import {Router} from "@angular/router";
import {GenericDataService} from "../remote/generic-data.service";
import {ITemperatureData} from "../../../../server/entities/data.interface";
import {TemperatureDataService} from "./temperature-data.service";

@Component({
  selector: 'app-temperature-view',
  templateUrl: './temperature-view.component.html',
  styleUrls: ['./temperature-view.component.scss']
})
export class TemperatureViewComponent implements OnInit {

  @Input() private temperatureDevice: ITemperatureDevice;
  private temperatureDataService: TemperatureDataService;

  constructor(private router: Router, private socketService: ClientSocketService, private authHttp: AuthHttp) {
  }

  ngOnInit() {
    this.temperatureDataService = new TemperatureDataService(this.socketService, this.authHttp, this.temperatureDevice.id);
  }

  ngOnDestroy() {
    this.temperatureDataService.onDestroy();
  }
}
