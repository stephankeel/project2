import {Document, Schema, Model, model} from 'mongoose';
import {IUser} from '../entities/user.interface';

export interface IUserModel extends IUser, Document{};

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

export const User: Model<IUserModel> = model<IUserModel>('User', UserSchema);
