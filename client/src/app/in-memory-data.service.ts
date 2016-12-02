import { Injectable } from '@angular/core';
import {InMemoryDbService} from 'angular-in-memory-web-api';

import {User} from './user';

@Injectable()
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    let users = [
      new User(1, 'Stephan', 'Keel', 'keel', 'gugus'),
      new User(2, 'David', 'Leuenberger', 'leuenberger', 'david')
    ];
    return {users};
  }
}
