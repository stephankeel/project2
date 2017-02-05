import {Observable} from 'rxjs/Observable';

export const enum Direction {
  INPUT,
  OUTPUT
}

export abstract class AbstractGPIO {
  constructor(protected id: number) {
  }

  public abstract getName(): string;
  public abstract directionVerb(): string;
  public abstract setState(on: boolean): void;
  public abstract watch(): Observable<boolean>;
  public abstract reset(): void;
  public abstract toString(): string;
}

export abstract class AbstractAIN {
  constructor(protected id: number) {
  }

  public abstract getName(): string;
  public abstract poll(intervalSeconds: number): Observable<number>;
  public abstract stopPolling(): void;
}

export abstract class AbstractLED {
  constructor(protected id: number) {
  }

  public abstract getName(): string;
  public abstract setState(state: number): void;
  public abstract blink(delayOn: number, delayOff: number): void;
  public abstract heartbeat(): void;
}
