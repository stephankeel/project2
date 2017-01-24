import {HumidityDataModel} from '../../models/humidity-data.model';

describe('Humidity-Data-Model Test', function () {

  it('should be invalid if empty', done => {
    let d = new HumidityDataModel();
    d.validate((err: any) => {
      expect(err.errors.deviceId).toBeDefined();
      expect(err.errors.timestamp).toBeDefined();
      expect(err.errors.value).toBeDefined();
      done();
    });
  });

  it('should have no error about timestamp, if "timestamp" is set to a number', done => {
    let d = new HumidityDataModel({timestamp: 122345667});
    d.validate((err: any) => {
      expect(err.errors.timestamp).not.toBeDefined();
      done();
    });
  });

  it('should have an error about timestamp, if "timestamp" is set to a string', done => {
    let d = new HumidityDataModel({timestamp: "abc"});
    d.validate((err: any) => {
      expect(err.errors.timestamp).toBeDefined();
      done();
    });
  });

  it('should have no error about value, if "value" is set to a number', done => {
    let d = new HumidityDataModel({value: 122345667});
    d.validate((err: any) => {
      expect(err.errors.value).not.toBeDefined();
      done();
    });
  });

  it('should have an error about value, if "value" is set to a string', done => {
    let d = new HumidityDataModel({value: "abc"});
    d.validate((err: any) => {
      expect(err.errors.value).toBeDefined();
      done();
    });
  });

  it('should be valid if is deviceId, timestamp and value are set with valid values', done => {
    let d = new HumidityDataModel({deviceId: "12345", timestamp: 1000000, value: 12.5});
    d.validate((err: any) => {
      expect(err).toBeNull();
      done();
    });
  });
});
