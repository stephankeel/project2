import {Component, OnInit} from '@angular/core';
import {Router}    from '@angular/router';
import {ClientSocketService} from '../remote/client-socket.service';
import {GenericService} from "../remote/generic.service";
import {AuthHttp} from "angular2-jwt";
import {ITemperatureDevice} from "../../../../server/entities/device.interface";
import {NotificationService} from '../notification/notification.service';

@Component({
  selector: 'app-temperature',
  templateUrl: './temperature.component.html',
  styleUrls: ['./temperature.component.scss']
})
export class TemperatureComponent implements OnInit {

  public temperatureService: GenericService<ITemperatureDevice>;

  constructor(private router: Router, private socketService: ClientSocketService, private authHttp: AuthHttp, private notificationService: NotificationService) {
  }

  ngOnInit() {
    this.temperatureService = new GenericService<ITemperatureDevice>(this.authHttp,
      this.socketService, this.notificationService, "/api/devices/temperature", "/temperature");
    this.temperatureService.getAll();
  }

  backClicked(): void {
    this.router.navigate(['/dashboard']);
  }
}
