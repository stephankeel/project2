import {Logger, getLogger} from '../utils/logger';
import {Document, Schema, Model, model} from 'mongoose';
import {IUser} from '../entities/user.interface';
import {UserType} from '../entities/user-type';
import {hash, compare} from 'bcrypt';

const LOGGER: Logger = getLogger('UserModel');

export interface IUserDocument extends IUser, Document {
}

let UserSchema = new Schema({
  id: String,
  firstname: {type: String, required: true, minlength: 2, maxlength: 20},
  lastname: {type: String, required: true, minlength: 2, maxlength: 20},
  type: {type: Number, required: true, min: UserType.GUEST, max: UserType.ADMIN},
  username: {type: String, required: true, minlength: 4, maxlength: 20, unique: true},
  password: {type: String, required: true, minlength: 8}
}, {
  versionKey: false, // avoids __v, i.e. the version key
});

UserSchema.pre(`save`, function (next) {
  let user: IUserDocument = this;

// only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next();

  hash(user.password, 8, function (err, hash) {
    if (err) return next(err);

    // override the cleartext password with the hashed one
    user.password = hash;
    next();
  });
});

export const UserModel: Model<IUserDocument> = model<IUserDocument>('User', UserSchema);

export function initAdmin(password: string) {
  let username: String = 'admin';
  let selector = {'username': username};
  UserModel.find(selector, (err, users) => {
    if (users.length) {
      LOGGER.info(`admin user is ok. id = ${users[0]._id}`);
      return;
    }

    let user: IUserDocument = new UserModel();
    user.firstname = 'admin';
    user.lastname = 'admin';
    user.type = UserType.ADMIN;
    user.username = 'admin';
    user.password = password;
    LOGGER.info(`creating admin user: ${JSON.stringify(user)}`);
    user.save((err: any, adminUser: IUserDocument) => {
      if (err) {
        throw new Error(err);
      } else {
        LOGGER.info(`Admin user created successfully: ${adminUser}`)
      }
    });
  });
}
