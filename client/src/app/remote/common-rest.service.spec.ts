/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { CommonRestService } from './common-rest.service';

describe('CommonRestService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CommonRestService]
    });
  });

  it('should ...', inject([CommonRestService], (service: CommonRestService) => {
    expect(service).toBeTruthy();
  }));
});
