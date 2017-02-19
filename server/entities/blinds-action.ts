export enum BlindsAction {
  OPEN, CLOSE, STOP
}

export const BlindsActionString: string[] = ['open', 'close', 'stop'];

export function blindsActionAsString(blindsAction: BlindsAction) {
  return BlindsActionString[blindsAction];
}

