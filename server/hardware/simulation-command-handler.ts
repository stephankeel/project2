import {ReadLine, createInterface} from 'readline';
import {disableLogging, enableLogging, setLevel} from '../utils/logger';
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
      let origCmd: string = cmd;
      cmd = cmd.toLowerCase();
      if (cmd.startsWith('?') || cmd.startsWith('help') || !cmd.length) {
        disableLogging();
        console.log('H E L P');
        console.log('=======');
        console.log('exit --> app will be stopped');
        console.log('log4js [on|off]');
        console.log('log4js [category] [level] --> example: log4js GenericSocket WARN');
        console.log('ain [hw port-id] [value]  --> see ports-factory.createPortToPinMap');
        console.log('gpi [hw port-id] [0|1]    --> mapping as ^^^^^');
      } else if (cmd.startsWith('exit')) {
          console.log(`${cmd} --> exit SIMULATION`);
          process.exit(1);
      } else if (cmd.startsWith('log4js on')) {
        enableLogging()
      } else if (cmd.startsWith('log4js off')) {
        disableLogging();
      } else if (cmd.startsWith('log4js ')) {
        let parts: string[] = origCmd.split(' ');
        if (parts.length === 3) {
          console.log(`setLevel of ${parts[1]} to ${parts[2].toUpperCase()}`);
          setLevel(parts[1], parts[2].toUpperCase());
        }
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
