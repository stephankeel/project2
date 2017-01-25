import {IData} from '../entities/data.interface';
import {GenericSocket} from './generic-socket';


/**
 * This class generates Values and calls the broadcastFunction of GenericSocket every second.
 *
 * This class is only used for tests.
 */
export class GenericGenerator<T extends IData> {
  private generatedValue: number = 20;

  constructor(private tempSocket: GenericSocket<T>, private createDataContent: (generatedValue: number) => T) {
    setInterval(() => {
      this.generatedValue += 0.1;
      tempSocket.update(createDataContent(this.generatedValue));
    }, 1000);
  }
}
