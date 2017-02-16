'use strict';

export enum BlindsState {
  OPEN, CLOSED, ANYWHERE, OPENING, CLOSING
}

export const blindsStateValues: BlindsState[] = [BlindsState.OPEN, BlindsState.CLOSED, BlindsState.ANYWHERE, BlindsState.OPENING, BlindsState.CLOSING];


export const BlindsStateString: string[] = ['open', 'closed', 'anywhere', 'opening', 'closing'];

export function blindsStateAsString(blindsState: BlindsState) {
  return BlindsStateString[blindsState];
}
