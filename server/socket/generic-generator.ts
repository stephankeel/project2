import {GenericSocket} from './generic-socket';

/**
 * This class generates Values and calls the broadcastFunction of GenericSocket every second.
 *
 * This class is only used for tests.
 */
export class GenericGenerator {
  private generatedValue: number = 20;

  constructor(private socket: GenericSocket, private createDataContent: (generatedValue: number) => any) {
    setInterval(() => {
      this.generatedValue += 0.1;
      socket.update(createDataContent(this.generatedValue));
    }, 1000);
  }
}
