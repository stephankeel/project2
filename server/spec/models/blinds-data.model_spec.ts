import {BlindsDataModel} from '../../models/blinds-data.model';
import {BlindsState, blindsStateValues} from '../../entities/blinds-state';

describe('Blinds-Data-Model Test', function () {

  it('should be invalid if empty', done => {
    let d = new BlindsDataModel();
    d.validate((err: any) => {
      expect(err.errors.deviceId).toBeDefined();
      expect(err.errors.timestamp).toBeDefined();
      expect(err.errors.state).toBeDefined();
      done();
    });
  });

  it('should have no error about timestamp, if "timestamp" is set to a number', done => {
    let d = new BlindsDataModel({timestamp: 122345667});
    d.validate((err: any) => {
      expect(err.errors.timestamp).not.toBeDefined();
      done();
    });
  });

  it('should have an error about timestamp, if "timestamp" is set to a string', done => {
    let d = new BlindsDataModel({timestamp: "abc"});
    d.validate((err: any) => {
      expect(err.errors.timestamp).toBeDefined();
      done();
    });
  });

  it('should have no error about state, if "state" are set to the minimum state (0)', done => {
    let d = new BlindsDataModel({state: blindsStateValues[0]});
    d.validate((err: any) => {
      expect(err.errors.state).not.toBeDefined();
      done();
    });
  });

  it('should have no error about state, if "state" are set to the maximal state (4)', done => {
    let d = new BlindsDataModel({state: blindsStateValues[blindsStateValues.length - 1]});
    d.validate((err: any) => {
      expect(err.errors.state).not.toBeDefined();
      done();
    });
  });

  it('should have error about state, if "state" are set to a state too small (less than 0)', done => {
    let d = new BlindsDataModel({state: blindsStateValues[0] - 1});
    d.validate((err: any) => {
      expect(err.errors.state).toBeDefined();
      done();
    });
  });

  it('should have error about state, if "state" are set to a state too big (more than 4)', done => {
    let d = new BlindsDataModel({state: blindsStateValues[blindsStateValues.length - 1] + 1});
    d.validate((err: any) => {
      expect(err.errors.state).toBeDefined();
      done();
    });
  });

  it('should be valid if is deviceId, timestamp, state and percentageDown are set with valid values', done => {
    let d = new BlindsDataModel({deviceId: "12345", timestamp: 1000000, state: BlindsState.CLOSED, percentageDown: 50});
    d.validate((err: any) => {
      expect(err).toBeNull();
      done();
    });
  });
});
