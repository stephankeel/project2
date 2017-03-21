import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-analog-view',
  templateUrl: './analog-view.component.html',
  styleUrls: ['./analog-view.component.scss']
})
export class AnalogViewComponent {

  @Input() name: string;
  @Input() value: number;
  @Input() units: string;
  @Input() timestamp: number;

  constructor() { }

}
