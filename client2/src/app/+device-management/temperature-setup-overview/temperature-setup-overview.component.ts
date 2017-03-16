import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-temperature-setup-overview',
  templateUrl: './temperature-setup-overview.component.html',
  styleUrls: ['./temperature-setup-overview.component.scss']
})
export class TemperatureSetupOverviewComponent implements OnInit {

  constructor(private router: Router, private route: ActivatedRoute) {
  }

  ngOnInit() {
  }

  back() {
    this.router.navigate(['../overview'], {relativeTo: this.route});
  }

  createTemperature() {
    this.router.navigate(['../overview'], {relativeTo: this.route});
  }

}
