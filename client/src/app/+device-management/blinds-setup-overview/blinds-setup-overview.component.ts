import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {BlindsDeviceCacheService} from "../../cache/service/blinds-device.cache.service";
import {Observable, ReplaySubject} from "rxjs";
import {AuthenticationService} from "../../remote/authentication.service";
import {List} from "immutable";
import {IBlindsDevice} from "../../../../../server/entities/device.interface";

@Component({
  selector: 'app-blinds-setup-overview',
  templateUrl: './blinds-setup-overview.component.html',
  styleUrls: ['./blinds-setup-overview.component.scss']
})
export class BlindsSetupOverviewComponent implements OnInit {

  private items: Observable<List<IBlindsDevice>> = new ReplaySubject<List<IBlindsDevice>>(1);

  constructor(private blindsDeviceCacheService: BlindsDeviceCacheService) {
  }

  ngOnInit() {
    this.blindsDeviceCacheService.getDataService().subscribe(blindsService => {
      this.items = blindsService.items;
    })
  }
}
