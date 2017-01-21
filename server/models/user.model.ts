'user strict';

import {logger} from '../utils/logger';
import {Document, Schema, Model, model} from 'mongoose';
import {IUser} from '../entities/user.interface';
import {UserType} from '../entities/user-type';

export interface IUserModel extends IUser, Document {
}
;

export let UserSchema = new Schema({
  id: String,
  firstname: String,
  lastname: String,
  type: {type: Number, required: true, min: UserType.GUEST, max: UserType.ADMIN},
  username: {type: String, required: true, minlength: 4, unique: true},
  password: {type: String, required: true, minlength: 4}
}, {
  versionKey: false, // avoids __v, i.e. the version key
});

/*
 UserSchema.pre('save', (next) => {
 // TODO: Pre save validation
 next();
 });
 */

export const User: Model<IUserModel> = model<IUserModel>('User', UserSchema);

export function initAdmin() {
  let username: String = 'admin';
  let selector = {'username': username}
  User.find(selector, (err, users) => {
    if (users.length) {
      logger.info(`admin user is ok. id = ${users[0]._id}`);
      return;
    }

    let user: IUserModel = new User();
    user.firstname = 'admin';
    user.lastname = 'admin';
    user.type = UserType.ADMIN;
    user.username = 'admin';
    user.password = '123456';
    logger.info(`creating admin user: ${JSON.stringify(user)}`);
    user.save((err: any, adminUser: IUserModel) => {
      if (err) {
        throw new Error(err);
      } else {
        logger.info(`Admin user created successfully: ${adminUser}`)
      }
    });
  });
}
