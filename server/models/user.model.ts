import {Document, Schema, Model, model} from 'mongoose';
import {IUser} from '../entities/user.interface';
import {UserType} from '../entities/user-type';

export interface IUserModel extends IUser, Document {
};

export let UserSchema = new Schema({
    id: String,
    firstname: String,
    lastname: String,
    type: Number,
    username: String,
    password: String,
}, {
    versionKey: false, // avoids __v, i.e. the version key
});

export const User:Model<IUserModel> = model<IUserModel>('User', UserSchema);

export function initAdmin() {
    let username:String = 'admin';
    let selector = {'username': username}
    User.find(selector, (err, users) => {
        if (users.length) {
            console.log(`admin user is ok. id = ${users[0]._id}`);
            return;
        }

        let user:IUserModel = new User();
        user.firstname = 'admin';
        user.lastname = 'admin';
        user.type = UserType.ADMIN;
        user.username = 'admin';
        user.password = '123456';
        console.log(`creating admin user: ${JSON.stringify(user)}`);
        user.save((err:any, adminUser:IUserModel) => {
            if (err) {
                throw new Error(err);
            } else {
                console.log(`Admin user created successfully: ${adminUser}`)
            }
        });
    });
}