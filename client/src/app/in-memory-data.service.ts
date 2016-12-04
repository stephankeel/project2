import {Injectable} from '@angular/core';
import {InMemoryDbService} from 'angular-in-memory-web-api';

import {User} from './user';

@Injectable()
export class InMemoryDataService implements InMemoryDbService {
    createDb() {
        let users = [
            new User(1, 'Stephan', 'Keel', User.ADMIN, 'keel', 'gugus'),
            new User(2, 'David', 'Leuenberger', User.ADMIN, 'leuenberger', 'david'),
            new User(3, 'Hans', 'Müller', User.STANDARD, 'mueller', '1234'),
            new User(4, 'Gast', 'Gast', User.GUEST, 'gast', 'gast'),
        ];
        return {users};
    }
}
