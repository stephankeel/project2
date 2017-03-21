import {Component, OnInit} from "@angular/core";
import {IBlindsDevice} from "../../../../../../server/entities/device.interface";
import {Subscription} from "rxjs";
import {BlindsDeviceCacheService} from "../../../cache/blinds-device.cache.service";
import {ActivatedRoute, Router} from "@angular/router";
import {NotificationService} from "../../../notification/notification.service";
import {DigitalPortService} from "../../service/digital-port.service";
import {portName, Port} from "../../../../../../server/hardware/port-map";
import {PortHandler} from "../../service/port-handler";

@Component({
  selector: 'app-blindsdevice-change',
  templateUrl: './blindsdevice-change.component.html',
  styleUrls: ['./blindsdevice-change.component.scss']
})
export class BlindsdeviceChangeComponent implements OnInit {
  private subscriptions: Subscription[] = [];
  private blind: IBlindsDevice = {};
  private title: string;
  private backlink = "..";
  private unusedInputPortHandler: PortHandler;
  private unusedOutputPortHandler: PortHandler;

  constructor(private blindsCacheService: BlindsDeviceCacheService,
              private route: ActivatedRoute,
              private router: Router,
              private notificationService: NotificationService,
              private digitalPortService: DigitalPortService) {
  }

  ngOnInit() {
    this.unusedInputPortHandler = new PortHandler(() => this.digitalPortService.getUnusedInputPorts());
    this.unusedOutputPortHandler = new PortHandler(() => this.digitalPortService.getUnusedOutputPorts());
    this.subscriptions.push(this.route.params.subscribe(params => {
      if (params['id']) {
        this.blindsCacheService.getDataService().subscribe(dataService => {
          this.blind = dataService.getCache(params['id']);
          this.unusedInputPortHandler.registerPorts([this.blind.keyDown, this.blind.keyUp]);
          this.unusedOutputPortHandler.registerPorts([this.blind.actorDown, this.blind.actorUp]);
          this.title = "Rollladen ändern";
          this.backlink = "../.."
        });
      } else {
        this.title = "Neuer Rollladen anlegen";
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
    this.blindsCacheService.getDataService().subscribe(dataService => {
      if (this.blind.id) {
        blind.id = this.blind.id;
        dataService.getRestService().update(blind).subscribe(user => {
          this.notificationService.info("Rollladen aktualisiert");
          this.router.navigate(['../..'], {relativeTo: this.route});
        }, error => {
          this.notificationService.error(`Aktualisierung vom Rollladen fehlgeschlagen (${JSON.stringify(error)})`);
        });
      } else {
        dataService.getRestService().add(blind).subscribe(user => {
          this.notificationService.info("Neuer Rollladen erstellt");
          this.router.navigate(['..'], {relativeTo: this.route});
        }, error => {
          this.notificationService.error(`Erstellung vom Rollladen fehlgeschlagen (${JSON.stringify(error)})`);
        });
      }
    });
  }

  cancel() {
    if (this.blind.id) {
      this.router.navigate(['../..'], {relativeTo: this.route});
    } else {
      this.router.navigate(['..'], {relativeTo: this.route});
    }
  }
}
