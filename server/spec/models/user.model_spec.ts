import {UserModel} from '../../models/user.model';
import {UserType} from '../../entities/user-type';

describe('User-Model Test', function () {

  it('should be invalid if empty', done => {
    let d = new UserModel();
    d.validate((err: any) => {
      expect(err.errors.type).toBeDefined();
      expect(err.errors.username).toBeDefined();
      expect(err.errors.password).toBeDefined();
      done();
    });
  });

  it('should have no error about username, if "username" is set to a string with 4 chars', done => {
    let d = new UserModel({username: "abcd"});
    d.validate((err: any) => {
      expect(err.errors.username).not.toBeDefined();
      done();
    });
  });

  it('should have an error about username, if "username" is set to a too short string (length 3)', done => {
    let d = new UserModel({username: "abc"});
    d.validate((err: any) => {
      expect(err.errors.username).toBeDefined();
      done();
    });
  });

  it('should have no error about password, if "password" is set to a string with 4 chars', done => {
    let d = new UserModel({password: "abcd"});
    d.validate((err: any) => {
      expect(err.errors.password).not.toBeDefined();
      done();
    });
  });

  it('should have an error about password, if "password" is set to a too short string (length 3)', done => {
    let d = new UserModel({password: "abc"});
    d.validate((err: any) => {
      expect(err.errors.password).toBeDefined();
      done();
    });
  });

  it('should have no error about type, if "type" are set to the minimum analag input (0)', done => {
    let d = new UserModel({type: UserType.GUEST});
    d.validate((err: any) => {
      expect(err.errors.type).not.toBeDefined();
      done();
    });
  });

  it('should have no error about type, if "type" are set to the maximal analog input (2)', done => {
    let d = new UserModel({type: UserType.ADMIN});
    d.validate((err: any) => {
      expect(err.errors.type).not.toBeDefined();
      done();
    });
  });

  it('should have error about type, if "type" are set to a port too small (less than 0)', done => {
    let d = new UserModel({type: UserType.GUEST - 1});
    d.validate((err: any) => {
      expect(err.errors.type).toBeDefined();
      done();
    });
  });

  it('should have error about type, if "type" are set to a port too big (more than 2)', done => {
    let d = new UserModel({type: UserType.ADMIN + 1});
    d.validate((err: any) => {
      expect(err.errors.type).toBeDefined();
      done();
    });
  });

  it('should have an error about type, if "type" are set to a string', done => {
    let d = new UserModel({type: "Test"});
    d.validate((err: any) => {
      expect(err.errors.type).toBeDefined();
      done();
    });
  });

  it('should be valid if empty', done => {
    let d = new UserModel({type: 1, username: "abcd", password: "abcd", firstname:"ab", lastname: "cd"});
    d.validate((err: any) => {
      expect(err).toBeNull();
      done();
    });
  });
});
