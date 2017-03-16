import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-blinds-setup-overview',
  templateUrl: './blinds-setup-overview.component.html',
  styleUrls: ['./blinds-setup-overview.component.scss']
})
export class BlindsSetupOverviewComponent implements OnInit {

  constructor(private router: Router, private route: ActivatedRoute) {
  }

  ngOnInit() {
  }

  back() {
    this.router.navigate(['../overview'], {relativeTo: this.route});
  }

  createBlind() {
    this.router.navigate(['../overview'], {relativeTo: this.route});
  }

}
