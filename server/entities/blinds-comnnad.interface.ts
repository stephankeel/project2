import {IId} from './id.interface';
import {BlindsAction} from './blinds-action';

export interface IBlindsCommand {
  id?: IId;
  action?: BlindsAction;
}
