import {ActivatedRoute, Router, Params} from '@angular/router';
import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {BlindsDevice} from '../../../misc/device-pool';
import {IBlindsData} from "../../../../../../server/entities/data.interface";
import {AuthHttp} from "angular2-jwt";
import {GenericService} from "../../../remote/generic.service";
import {ClientSocketService} from "../../../remote/client-socket.service";
import {GenericDataService} from "../../../remote/generic-data.service";
import {NotificationService} from '../../../notification/notification.service';

@Component({
  selector: 'app-single-blinds',
  templateUrl: './single-blinds.component.html',
  styleUrls: ['./single-blinds.component.scss']
})
export class SingleBlindsComponent implements OnInit {

  private genericService: GenericService<BlindsDevice>;
  private dataService: GenericDataService<IBlindsData>;
  id: any;
  device: BlindsDevice;
  allDevices: BlindsDevice[] = [];
  deviceState: Observable<IBlindsData>;

  constructor(private route: ActivatedRoute, private router: Router, private socketService: ClientSocketService,
              private authHttp: AuthHttp, private notificationService: NotificationService) {
  }

  ngOnInit() {
    this.genericService = new GenericService<BlindsDevice>(this.authHttp, this.socketService, this.notificationService, "/api/devices/blinds", "/blinds");
    this.genericService.items.subscribe(devices => {
      this.allDevices = devices.toArray();
      this.resubscribe();
    }, error => this.notificationService.error(error.toString()));
    this.genericService.getAll();

    // list for route id changes
    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
      this.resubscribe();
    });
  }

  ngOnDestroy() {
    this.releaseDevice();
    this.genericService.disconnect();
  }

  resubscribe() {
    this.releaseDevice();
    if (this.allDevices.length > 0 && this.id) {
      let matchingDevices: BlindsDevice[] = this.allDevices.filter(device => device.id == this.id);
      if (matchingDevices.length > 0) {
        this.device = matchingDevices[0];
        this.subscribeDevice();
      }
    }
  }

  subscribeDevice(): void {
    if (this.device) {
      let dataService: GenericDataService<IBlindsData> = new GenericDataService<IBlindsData>(this.authHttp, this.socketService, '/api/data/blinds', '/blinds', this.device.id);
      this.dataService = dataService;
      this.deviceState = dataService.lastItem;
      dataService.getLatest();
    }
  }

  releaseDevice(): void {
    if (this.device) {
      let dataService: GenericDataService<IBlindsData> = this.dataService;
      if (dataService) {
        dataService.disconnect();
        this.dataService = null;
        this.deviceState = null;
      }
    }
  }

}
