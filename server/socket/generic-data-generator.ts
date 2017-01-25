import {IData} from '../entities/data.interface';
import {GenericDataSocket} from './generic-data-socket';


/**
 * This class generates Values and calls the broadcastFunction of GenericSocket every second.
 *
 * This class is only used for tests.
 */
export class GenericDataGenerator<T extends IData> {
  private generatedValue: number = 20;

  constructor(private tempSocket: GenericDataSocket<T>, private createDataContent: (generatedValue: number) => T) {
    setInterval(() => {
      this.generatedValue += 0.1;
      tempSocket.broadcastTemperature(createDataContent(this.generatedValue));
    }, 1000);
  }
}
