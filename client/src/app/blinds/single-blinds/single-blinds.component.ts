import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {BlindsDevice} from '../../device-pool';

@Component({
  selector: 'app-single-blinds',
  templateUrl: './single-blinds.component.html',
  styleUrls: ['./single-blinds.component.scss']
})
export class SingleBlindsComponent implements OnInit {

  @Input() device: BlindsDevice;
  @Input() percentageDown: number;

  constructor() {
  }

  ngOnInit() {
  }

}
