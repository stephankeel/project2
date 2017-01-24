import {HumidityDeviceModel} from '../../models/humidity-device.model';
import {analogInputs} from '../../hardware/port-map';

describe('Humidity-Device-Model Test', function () {

  it('should be invalid if empty', done => {
    let d = new HumidityDeviceModel();
    d.validate((err: any) => {
      expect(err.errors.name).toBeDefined();
      expect(err.errors.port).toBeDefined();
      done();
    });
  });

  it('should have no error about name, if "name" is set to a string with 4 chars', done => {
    let d = new HumidityDeviceModel({name: "abcd"});
    d.validate((err: any) => {
      expect(err.errors.name).not.toBeDefined();
      done();
    });
  });

  it('should have an error about name, if "name" is set to a too short string (length 3)', done => {
    let d = new HumidityDeviceModel({name: "abc"});
    d.validate((err: any) => {
      expect(err.errors.name).toBeDefined();
      done();
    });
  });

  it('should have no error about port, if "port" are set to the minimum analag input (16)', done => {
    let d = new HumidityDeviceModel({port: analogInputs[0]});
    d.validate((err: any) => {
      expect(err.errors.port).not.toBeDefined();
      done();
    });
  });

  it('should have no error about port, if "port" are set to the maximal analog input (19)', done => {
    let d = new HumidityDeviceModel({port: analogInputs[analogInputs.length - 1]});
    d.validate((err: any) => {
      expect(err.errors.port).not.toBeDefined();
      done();
    });
  });

  it('should have error about port, if "port" are set to a port too small (less than 16)', done => {
    let d = new HumidityDeviceModel({port: analogInputs[0] - 1});
    d.validate((err: any) => {
      expect(err.errors.port).toBeDefined();
      done();
    });
  });

  it('should have error about port, if "port" are set to a port too big (more than 19)', done => {
    let d = new HumidityDeviceModel({port: analogInputs[analogInputs.length - 1] + 1});
    d.validate((err: any) => {
      expect(err.errors.port).toBeDefined();
      done();
    });
  });

  it('should have an error about port, if "port" are set to a string', done => {
    let d = new HumidityDeviceModel({port: "Port.DI_1"});
    d.validate((err: any) => {
      expect(err.errors.port).toBeDefined();
      done();
    });
  });

  it('should be valid if is name and port are set with valid values', done => {
    let d = new HumidityDeviceModel({name: "abcde", port: analogInputs[2]});
    d.validate((err: any) => {
      expect(err).toBeNull();
      done();
    });
  });
});
