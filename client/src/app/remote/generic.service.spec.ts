import {inject, TestBed} from '@angular/core/testing';
import {GenericService} from './generic.service';
import {IUser} from '../../../../server/entities/user.interface';

describe('GenericService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GenericService]
    });
  });

  it('should ...', inject([GenericService], (service: GenericService<IUser>) => {
    expect(service).toBeTruthy();
  }));
});
