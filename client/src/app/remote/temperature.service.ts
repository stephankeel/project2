import {Injectable} from "@angular/core";
import {ReplaySubject} from "rxjs";

import {SocketService} from "./socket.service";

import {ISocketItem} from './../../../../server/entities/socket-item.model';
import {ITemperatureData} from "../../../../server/entities/data.interface";


/**
 * This class wraps the SocketService for the temperature sensor usage.
 */
@Injectable()
export class TemperatureService {
  private _values = new ReplaySubject<ITemperatureData>();

  constructor(private sensorId: string, private socketService: SocketService) {
    this.socketService
      .get("temperature/" + encodeURIComponent(this.sensorId))
      .subscribe(
        (socketItem: ISocketItem) => {
          console.log("subscribe called");
          if (socketItem.action === "update") {
            this._values.next(socketItem.item);
          } else {
            console.error(`unknown action in this namespace (/temperature/${this.sensorId}): ${socketItem.action}`);
          }
        },
        error => console.log(error)
      )
  }

  /**
   * @returns {ReplaySubject<ITemperatureData>} This observable follows the
   *                temperature updates of the temperaturesensor with speific sensorId.
   */
  get values(): ReplaySubject<ITemperatureData> {
    return this._values;
  }
}
