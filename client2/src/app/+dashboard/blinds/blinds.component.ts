import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from "@angular/router";
import {BlindsDataObservablePipe} from './pipes/blinds-data-observable.pipe';
import {BlindsDataFormatterPipe} from './pipes/blinds-data-formatter.pipe';

@Component({
  selector: 'app-blinds',
  templateUrl: './blinds.component.html',
  styleUrls: ['./blinds.component.scss'],
  providers: [BlindsDataObservablePipe, BlindsDataFormatterPipe]
})
export class BlindsComponent implements OnInit {

  constructor(private router: Router, private r: ActivatedRoute) {
  }

  ngOnInit() {
      this.showAll();
  }

  showAll(): void {
    this.router.navigate(['blinds'], {relativeTo: this.r});
  }

}
