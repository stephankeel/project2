import {Subject} from "rxjs";
import {IId} from "../entities/id.interface";

interface IAction {
  action: string;
  value: any;
}

export class GenericSubject<T, S extends IId> {
  private actions: Subject<IAction> = new Subject<IAction>();

  private listeners: Map<string, Set<any>> = new Map<string, Set<any>>();

  constructor() {
    this.actions.subscribe((action: IAction) => {
      this.listeners.get(action.action).forEach((listener: any) => {
        listener(action.value);
      })
    });
  }

  private emit<R>(action: string, value: R) {
    this.actions.next({action: action, value: value});
  }

  private onListen<R>(action: string, callbackfn: (value: R) => void) {
    if (!this.listeners.has(action)) {
      this.listeners.set(action, new Set<R>());
    }
    this.listeners.get(action).add(callbackfn);
  }

  public create(value: S) {
    this.emit<S>("create", value);
  }

  public onCreateListener(callbackfn: (value: S) => void) {
    this.onListen<S>("create", callbackfn);
  }

  public update(value: S) {
    this.emit<S>("update", value);
  }

  public onUpdateListener(callbackfn: (value: S) => void) {
    this.onListen<S>("update", callbackfn);
  }

  public del(value: T) {
    this.emit<T>("delete", value);
  }

  public onDeleteListener(callbackfn: (value: S) => void) {
    this.onListen<S>("delete", callbackfn);
  }
}
