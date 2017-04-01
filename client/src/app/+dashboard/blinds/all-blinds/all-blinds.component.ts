import {ActivatedRoute, Router} from '@angular/router';
import {Component} from '@angular/core';
import {BlindsDeviceCacheService} from '../../../cache/service/blinds-device.cache.service';
import {BlindDataCacheService} from '../../../cache/service/blinds-data.cache.service';


@Component({
  selector: 'app-all-blinds',
  templateUrl: './all-blinds.component.html',
  styleUrls: ['./all-blinds.component.scss']
})
export class AllBlindsComponent {

  constructor(private route: ActivatedRoute,
              private router: Router,
              public blindsDeviceCacheService: BlindsDeviceCacheService,
              public blindDataCacheService: BlindDataCacheService) {
  }

  private select(deviceId: string): void {
    this.router.navigate(['../blinds', deviceId], {relativeTo: this.route});
  }
}
