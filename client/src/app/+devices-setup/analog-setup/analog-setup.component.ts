import {Component, OnInit, EventEmitter, Input, Output} from '@angular/core';
import {IAnalogDevice} from '../../../../../server/entities/device.interface'
import {portName, Port} from '../../device-pool';

@Component({
  selector: 'app-analog-setup',
  templateUrl: './analog-setup.component.html',
  styleUrls: ['./analog-setup.component.scss']
})
export class AnalogSetupComponent implements OnInit {

  @Input() private device: IAnalogDevice;
  @Input() private ports: Port[];
  @Output() clearMessageOnParent = new EventEmitter<void>();

  constructor() {
  }

  ngOnInit() {
  }

  getPortName(port: Port): string {
    return portName(port);
  }

  clearMessage(): void {
    this.clearMessageOnParent.emit();
  }

}
