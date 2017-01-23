import {ITemperatureItem} from '../entities/temperature.model';
import {TemperatureSocket} from './temperature-socket';
import {logger} from '../utils/logger';


/**
 * This class generates ITemperatureItems and calls the broadcastFunction of tempSocket every 200ms.
 *
 * This class is only used for tests.
 */
export class TemperatureGenerator {
  private generatedValue: number = 20;

  constructor(private tempSocket: TemperatureSocket) {
    setInterval(() => {
      this.generatedValue += 0.1;
      let data : ITemperatureItem = {date: new Date(), value: this.generatedValue};
      tempSocket.broadcastTemperature(data);
    }, 1000);
  }
}
