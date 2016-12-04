export class User {
    static STANDARD: number = 1;
    static ADMIN: number = 2;
    static GUEST: number = 3;

    constructor(public id?: number,
                public firstname?: string,
                public lastname?: string,
                public type?: number,
                public username?: string,
                public password?: string) {
    }

    isStandardUser(): boolean {
        return this.type == User.STANDARD;
    }

    isAdminUser(): boolean {
        return this.type == User.ADMIN;
    }

    isGuestUser(): boolean {
        return this.type == User.GUEST;
    }

}