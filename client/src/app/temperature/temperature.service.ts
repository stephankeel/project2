import {Injectable, OnInit} from '@angular/core';
import {ITemperatureDevice} from "../../../../server/entities/device.interface";
import {ITemperatureData} from "../../../../server/entities/data.interface";
import {ClientSocketService} from "../remote/client-socket.service";
import {AuthHttp} from "angular2-jwt";
import {GenericService} from "../remote/generic.service";
import {Subscription} from "rxjs";

@Injectable()
export class TemperatureService {
  private temperatureService: GenericService<ITemperatureDevice>;
  public temperatureDevices: ITemperatureDevice[] = [];

  private itemsSubscription: Subscription;
  private initialized: boolean;

  constructor(private socketService: ClientSocketService, private authHttp: AuthHttp) {
  }

  init() {
    if (this.initialized) {
      return;
    }
    this.temperatureService = new GenericService<ITemperatureDevice>(this.authHttp,
      this.socketService, "/api/devices/temperature", "/temperature");
    this.itemsSubscription = this.temperatureService.items.subscribe(temperatureDevices => {
      this.temperatureDevices = temperatureDevices.toArray();
    });
    this.temperatureService.getAll();
  }

  ngOnDestroy() {
    this.itemsSubscription.unsubscribe();
  }
}
