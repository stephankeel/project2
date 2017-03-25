import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {BlindsDeviceCacheService} from "../../cache/service/blinds-device.cache.service";
import {Observable, ReplaySubject} from "rxjs";
import {AuthenticationService} from "../../remote/authentication.service";
import {List} from "immutable";
import {IBlindsDevice} from "../../../../../server/entities/device.interface";
import {DigitalPortService} from "../service/digital-port.service";

@Component({
  selector: 'app-blinds-setup-overview',
  templateUrl: './blinds-setup-overview.component.html',
  styleUrls: ['./blinds-setup-overview.component.scss']
})
export class BlindsSetupOverviewComponent {

  constructor(private blindsDeviceCacheService: BlindsDeviceCacheService,
              private digitalPortService: DigitalPortService) {
  }
}
