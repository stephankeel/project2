import {TestBed, inject} from '@angular/core/testing';

import {PortsService} from './ports.service';
import {analogInputs, digitalInputs, digitalOutputs} from "../../../../../server/hardware/port-map";

describe('PortsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PortsService]
    });
  });

  it('should be created', inject([PortsService], (service: PortsService) => {
    expect(service).toBeTruthy();
  }));

  it('should return analog-input-ports', inject([PortsService], (service: PortsService) => {
    expect(service.getAnalogInputs()).toEqual(analogInputs);
  }));

  it('should return digital-input-ports', inject([PortsService], (service: PortsService) => {
    expect(service.getDigitalInputs()).toEqual(digitalInputs);
  }));

  it('should return digital-output-ports', inject([PortsService], (service: PortsService) => {
    expect(service.getDigitalOutputs()).toEqual(digitalOutputs);
  }));
});
