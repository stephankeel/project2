import {Injectable} from '@angular/core';
import {analogInputs, digitalInputs, digitalOutputs, Port} from '../../../../../server/hardware/port-map';

@Injectable()
export class PortsService {

  constructor() {
  }

  getDigitalInputs(): Port[] {
    return digitalInputs;
  }

  getDigitalOutputs(): Port[] {
    return digitalOutputs;
  }

  getAnalogInputs(): Port[] {
    return analogInputs;
  }
}
