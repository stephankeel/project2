import {Observable} from 'rxjs/Observable';

export const enum Direction {
  INPUT,
  OUTPUT
}

export interface I_GPIO {
  getName(): string;
  directionVerb(): string;
  setState(on: boolean): void;
  watch(): Observable<boolean>;
  reset(): void;
  toString(): string;
}

export interface I_AIN {
  getName(): string;
  poll(intervalSeconds: number): Observable<number>;
  stopPolling(): void;
}

export interface I_LED {
  getName(): string;
  setState(state: number): void;
  blink(delayOn: number, delayOff: number): void;
  heartbeat(): void;
}
