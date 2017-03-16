import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-humidity-setup-overview',
  templateUrl: './humidity-setup-overview.component.html',
  styleUrls: ['./humidity-setup-overview.component.scss']
})
export class HumiditySetupOverviewComponent implements OnInit {
  constructor(private router: Router, private route: ActivatedRoute) {
  }

  ngOnInit() {
  }

  back() {
    this.router.navigate(['../overview'], {relativeTo: this.route});
  }

  createHimidity() {
    this.router.navigate(['../overview'], {relativeTo: this.route});
  }
}
