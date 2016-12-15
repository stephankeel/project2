import {IUser} from '../../../server/entities/user.interface';

export class User implements IUser{
    static STANDARD: number = 0;
    static ADMIN: number = 1;
    static GUEST: number = 2;

    constructor(public id?: any,
                public firstname?: string,
                public lastname?: string,
                public type?: number,
                public username?: string,
                public password?: string) {
    }

    static getUserTypes(): number[] {
        return [User.STANDARD, User.ADMIN, User.GUEST];
    }

    static getUserTypesText(): string[] {
        return ['Standard', 'Admin', 'Gast'];
    }

    isUserType(type: number): boolean {
        return this.type === type;
    }

    isStandardUser(): boolean {
        return this.type ===User.STANDARD;
    }

    isAdminUser(): boolean {
        return this.type === User.ADMIN;
    }

    isGuestUser(): boolean {
        return this.type === User.GUEST;
    }

}
