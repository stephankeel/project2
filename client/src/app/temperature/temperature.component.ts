import {Component, OnInit} from '@angular/core';
import {Router}    from '@angular/router';
import {SocketService} from '../remote/socket.service';
import {TemperatureService} from '../remote/temperature.service';
import {ITemperatureItem} from "../../../../server/entities/temperature.model";

@Component({
  selector: 'app-temperature',
  templateUrl: './temperature.component.html',
  styleUrls: ['./temperature.component.scss']
})
export class TemperatureComponent implements OnInit {

  private temp1: TemperatureService;
  private lastValue: number;

  constructor(private socketService : SocketService, private router: Router) {
  }

  ngOnInit() {
    this.temp1 = new TemperatureService("1", this.socketService);
    this.temp1.values.subscribe((temperatureItem: ITemperatureItem) => {
        this.lastValue = temperatureItem.value;
        console.log("subscribe called");
      },
      error => console.log(error));
  }

  backClicked(): void {
    this.router.navigate(['/dashboard']);
  }
}
