import {GenericSocket} from './generic-socket';
import {GenericDataController} from "../controllers/generic.data-controller";
import {IDeviceDocument} from "../models/model-helper";

/**
 * This class generates Values and calls the broadcastFunction of GenericSocket every second.
 *
 * This class is only used for tests.
 */
export class GenericGenerator {
  private generatedValue: number = 20;

  constructor(private callback: (value: number) => void) {
    setInterval(() => {
      this.generatedValue += 0.1;
      callback(this.generatedValue);
    }, 1000);
  }
}
