import {Component, OnInit} from "@angular/core";
import {IBlindsDevice, IHumidityDevice} from "../../../../../../server/entities/device.interface";
import {Subscription} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {NotificationService} from "../../../notification/notification.service";
import {portName, Port} from "../../../../../../server/hardware/port-map";
import {PortHandler} from "../../service/port-handler";
import {HumidityDeviceCacheService} from "../../../cache/humidity-device.cache.service";
import {AnalogPortService} from "../../service/analog-port.service";

@Component({
  selector: 'app-humiditydevice-change',
  templateUrl: './humiditydevice-change.component.html',
  styleUrls: ['./humiditydevice-change.component.scss']
})
export class HumiditydeviceChangeComponent implements OnInit {

  private subscriptions: Subscription[] = [];
  private humidityDevice: IHumidityDevice= {};
  private title: string;
  private backlink = "..";
  private unusedPortHandler: PortHandler;

  constructor(private  humidityDeviceCacheService: HumidityDeviceCacheService,
              private route: ActivatedRoute,
              private router: Router,
              private notificationService: NotificationService,
              private analogPortService: AnalogPortService) {
  }

  ngOnInit() {
    this.unusedPortHandler = new PortHandler(() => this.analogPortService.getUnusedInputPorts());
    this.subscriptions.push(this.route.params.subscribe(params => {
      if (params['id']) {
        this.humidityDeviceCacheService.getDataService().subscribe(dataService => {
          this.humidityDevice = dataService.getCache(params['id']);
          this.unusedPortHandler.registerPorts([this.humidityDevice.port]);
          this.title = "Feuchtigkeitssensor ändern";
          this.backlink = "../.."
        });
      } else {
        this.title = "Neuer Feuchtigkeitssensor anlegen";
      }
    }));
  }

  getPortName(port: Port): string {
    return portName(port);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe);
  }

  submit(blind: IBlindsDevice) {
    this.humidityDeviceCacheService.getDataService().subscribe(dataService => {
      if (this.humidityDevice.id) {
        blind.id = this.humidityDevice.id;
        dataService.getRestService().update(blind).subscribe(user => {
          this.notificationService.info("Feuchtigkeitssensor aktualisiert");
          this.router.navigate(['../..'], {relativeTo: this.route});
        }, error => {
          this.notificationService.error(`Aktualisierung vom Feuchtigkeitssensor fehlgeschlagen (${JSON.stringify(error)})`);
        });
      } else {
        dataService.getRestService().add(blind).subscribe(user => {
          this.notificationService.info("Neuer Rollladen erstellt");
          this.router.navigate(['..'], {relativeTo: this.route});
        }, error => {
          this.notificationService.error(`Erstellung vom Feuchtigkeitssensor fehlgeschlagen (${JSON.stringify(error)})`);
        });
      }
    });
  }

  cancel() {
    if (this.humidityDevice.id) {
      this.router.navigate(['../..'], {relativeTo: this.route});
    } else {
      this.router.navigate(['..'], {relativeTo: this.route});
    }
  }
}
