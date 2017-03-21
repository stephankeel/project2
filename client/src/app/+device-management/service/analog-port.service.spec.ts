import { TestBed, inject } from '@angular/core/testing';

import { AnalogPortService } from './analog-port.service';

describe('AnalogPortService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AnalogPortService]
    });
  });

  it('should ...', inject([AnalogPortService], (service: AnalogPortService) => {
    expect(service).toBeTruthy();
  }));
});
