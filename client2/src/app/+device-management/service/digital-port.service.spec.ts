import { TestBed, inject } from '@angular/core/testing';

import { DigitalPortService } from './digital-port.service';

describe('DigitalPortService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DigitalPortService]
    });
  });

  it('should ...', inject([DigitalPortService], (service: DigitalPortService) => {
    expect(service).toBeTruthy();
  }));
});
