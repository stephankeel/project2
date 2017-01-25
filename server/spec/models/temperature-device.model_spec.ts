import {TemperatureDeviceModel} from '../../models/temperature-device.model';
import {analogInputs} from '../../hardware/port-map';

describe('Temperature-Device-Model Test', function () {

  it('should be invalid if empty', done => {
    let d = new TemperatureDeviceModel();
    d.validate((err: any) => {
      expect(err.errors.name).toBeDefined();
      expect(err.errors.port).toBeDefined();
      done();
    });
  });

  it('should have no error about name, if "name" is set to a string with 4 chars', done => {
    let d = new TemperatureDeviceModel({name: "abcd"});
    d.validate((err: any) => {
      expect(err.errors.name).not.toBeDefined();
      done();
    });
  });

  it('should have an error about name, if "name" is set to a too short string (length 3)', done => {
    let d = new TemperatureDeviceModel({name: "abc"});
    d.validate((err: any) => {
      expect(err.errors.name).toBeDefined();
      done();
    });
  });

  it('should have no error about port, if "port" are set to the minimum analag input (16)', done => {
    let d = new TemperatureDeviceModel({port: analogInputs[0]});
    d.validate((err: any) => {
      expect(err.errors.port).not.toBeDefined();
      done();
    });
  });

  it('should have no error about port, if "port" are set to the maximal analog input (19)', done => {
    let d = new TemperatureDeviceModel({port: analogInputs[analogInputs.length - 1]});
    d.validate((err: any) => {
      expect(err.errors.port).not.toBeDefined();
      done();
    });
  });

  it('should have error about port, if "port" are set to a port too small (less than 16)', done => {
    let d = new TemperatureDeviceModel({port: analogInputs[0] - 1});
    d.validate((err: any) => {
      expect(err.errors.port).toBeDefined();
      done();
    });
  });

  it('should have error about port, if "port" are set to a port too big (more than 19)', done => {
    let d = new TemperatureDeviceModel({port: analogInputs[analogInputs.length - 1] + 1});
    d.validate((err: any) => {
      expect(err.errors.port).toBeDefined();
      done();
    });
  });

  it('should have an error about port, if "port" are set to a string', done => {
    let d = new TemperatureDeviceModel({port: "Port.DI_1"});
    d.validate((err: any) => {
      expect(err.errors.port).toBeDefined();
      done();
    });
  });

  it('should be valid if is name and port are set with valid values', done => {
    let d = new TemperatureDeviceModel({name: "abcde", port: analogInputs[2]});
    d.validate((err: any) => {
      expect(err).toBeNull();
      done();
    });
  });
});
