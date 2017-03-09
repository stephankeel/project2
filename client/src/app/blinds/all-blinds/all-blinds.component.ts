import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {Observable} from 'rxjs';
import {BlindsDevice} from '../../device-pool';
import {IBlindsData} from "../../../../../server/entities/data.interface";

@Component({
  selector: 'app-all-blinds',
  templateUrl: './all-blinds.component.html',
  styleUrls: ['./all-blinds.component.scss']
})
export class AllBlindsComponent implements OnInit {

  @Input() devices: BlindsDevice[];
  @Input() devicesState: Map<BlindsDevice, Observable<IBlindsData>>;
  @Output() message: EventEmitter<string> = new EventEmitter<string>();

  constructor() {
  }

  ngOnInit() {
  }

  setMessage(str: string) {
    this.message.emit(str);
  }

}
