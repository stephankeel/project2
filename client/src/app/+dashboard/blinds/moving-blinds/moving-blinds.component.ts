import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-moving-blinds',
  templateUrl: './moving-blinds.component.html',
  styleUrls: ['./moving-blinds.component.scss']
})
export class MovingBlindsComponent {

  @Input() percentageDown: number;
  @Input() name?: string;

  constructor() {
  }
}
