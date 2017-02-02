import {Component, OnInit} from '@angular/core';
import {Router}    from '@angular/router';
import {ClientSocketService} from '../remote/client-socket.service';
import {ITemperatureData} from "../../../../server/entities/data.interface";
import {GenericService} from "../remote/generic.service";
import {AuthHttp} from "angular2-jwt";
import {AuthenticationService} from "../remote/authentication.service";
import {ITemperatureDevice} from "../../../../server/entities/device.interface";
import {TemperatureService} from "./temperature.service";

@Component({
  selector: 'app-temperature',
  templateUrl: './temperature.component.html',
  styleUrls: ['./temperature.component.scss']
})
export class TemperatureComponent implements OnInit {

  constructor(private router: Router, private socketService: ClientSocketService,
              private authHttp: AuthHttp, private temperatureService: TemperatureService) {
  }

  ngOnInit() {
    this.temperatureService = new TemperatureService(this.socketService, this.authHttp);
    this.temperatureService.init();
  }

  backClicked(): void {
    this.router.navigate(['/dashboard']);
  }
}
