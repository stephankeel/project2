/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { BlindsCommandService } from './blinds-command.service';

describe('BlindsCommandService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BlindsCommandService]
    });
  });

  it('should ...', inject([BlindsCommandService], (service: BlindsCommandService) => {
    expect(service).toBeTruthy();
  }));
});
