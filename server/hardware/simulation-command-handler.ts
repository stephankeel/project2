import {ReadLine, createInterface} from 'readline';
import {logger} from '../utils/logger';
import {Observable} from 'rxjs/Observable';
import {Subscriber} from 'rxjs/Subscriber';

export class SimulationCommandHandler {

  private static readonly singleton = new SimulationCommandHandler();
  private commandObservable: Observable<string>;
  private listeners: Map<Subscriber<string>, Subscriber<string>> = new Map<Subscriber<string>, Subscriber<string>>()

  private constructor() {
    this.init();
  }

  public static getInstance(): SimulationCommandHandler {
    return SimulationCommandHandler.singleton;
  }

  private init(): void {
    this.commandObservable = Observable.create((subscriber: Subscriber<string>) => {
      this.listeners.set(subscriber, subscriber);
      subscriber.add(() => this.listeners.delete(subscriber) );
    });
    let rl: ReadLine = createInterface({input: process.stdin, output: process.stdout});
    this.ask(rl);
  }

  private ask(rl: ReadLine) {
    rl.question('SIMULATION> ', (cmd: string) => {
      cmd = cmd.toLowerCase();
      if (cmd.startsWith('?') || cmd.startsWith('help') || !cmd.length) {
        logger.setLevel('OFF');
        console.log('H E L P');
        console.log('=======');
        console.log('exit --> app will be stopped');
        console.log('log4js [on|off]');
        console.log('ain [hw port-id] [value] --> see ports-factory.createPortToPinMap');
        console.log('gpi [hw port-id] [0|1]   --> mapping as ^^^^^');
      } else if (cmd.startsWith('exit')) {
          console.log(`${cmd} --> exit SIMULATION`);
          process.exit(1);
      } else if (cmd.startsWith('log4js on')) {
        logger.setLevel('ALL');
      } else if (cmd.startsWith('log4js off')) {
        logger.setLevel('OFF');
      } else {
          this.listeners.forEach((subscriber: Subscriber<string>) => subscriber.next(cmd));
      }
      this.ask(rl);
    });
  }

  public getCommandObservable(): Observable<string> {
    return this.commandObservable;
  }

}
