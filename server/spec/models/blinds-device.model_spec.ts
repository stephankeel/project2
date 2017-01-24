import {BlindsDeviceModel} from '../../models/blinds-device.model';
import {digitalInputs, digitalOutputs} from '../../hardware/port-map';

describe('Blinds-Device-Model Test', function () {

  it('should be invalid if empty', done => {
    let d = new BlindsDeviceModel();
    d.validate((err: any) => {
      expect(err.errors.name).toBeDefined();
      expect(err.errors.keyUp).toBeDefined();
      expect(err.errors.keyDown).toBeDefined();
      expect(err.errors.actorUp).toBeDefined();
      expect(err.errors.actorDown).toBeDefined();
      expect(err.errors.runningSeconds).toBeDefined();
      done();
    });
  });

  it('should have no error about name, if "name" is set to a string with 4 chars', done => {
    let d = new BlindsDeviceModel({name: "abcd"});
    d.validate((err: any) => {
      expect(err.errors.name).not.toBeDefined();
      done();
    });
  });

  it('should have an error about name, if "name" is set to a too short string (length 3)', done => {
    let d = new BlindsDeviceModel({name: "abc"});
    d.validate((err: any) => {
      expect(err.errors.name).toBeDefined();
      done();
    });
  });

  it('should have no error about keyUp, if "keyUp" are set to the minimum digital input (0)', done => {
    let d = new BlindsDeviceModel({keyUp: digitalInputs[0]});
    d.validate((err: any) => {
      expect(err.errors.keyUp).not.toBeDefined();
      done();
    });
  });

  it('should have no error about keyUp, if "keyUp" are set to the maximal digital input (7)', done => {
    let d = new BlindsDeviceModel({keyUp: digitalInputs[digitalInputs.length - 1]});
    d.validate((err: any) => {
      expect(err.errors.keyUp).not.toBeDefined();
      done();
    });
  });

  it('should have error about keyUp, if "keyUp" are set to a port too small (less than 0)', done => {
    let d = new BlindsDeviceModel({keyUp: digitalInputs[0] - 1});
    d.validate((err: any) => {
      expect(err.errors.keyUp).toBeDefined();
      done();
    });
  });

  it('should have error about keyUp, if "keyUp" are set to a port too big (more than 7)', done => {
    let d = new BlindsDeviceModel({keyUp: digitalInputs[digitalInputs.length - 1] + 1});
    d.validate((err: any) => {
      expect(err.errors.keyUp).toBeDefined();
      done();
    });
  });

  it('should have an error about keyUp, if "keyUp" are set to a string', done => {
    let d = new BlindsDeviceModel({keyUp: "Port.DI_1"});
    d.validate((err: any) => {
      expect(err.errors.keyUp).toBeDefined();
      done();
    });
  });

  it('should have no error about keyDown, if "keyDown" are set to the minimum digital input (0)', done => {
    let d = new BlindsDeviceModel({keyDown: digitalInputs[0]});
    d.validate((err: any) => {
      expect(err.errors.keyDown).not.toBeDefined();
      done();
    });
  });

  it('should have no error about keyDown, if "keyDown" are set to the maximal digital input (7)', done => {
    let d = new BlindsDeviceModel({keyDown: digitalInputs[digitalInputs.length - 1]});
    d.validate((err: any) => {
      expect(err.errors.keyDown).not.toBeDefined();
      done();
    });
  });

  it('should have error about keyDown, if "keyDown" are set to a port too small (less than 0)', done => {
    let d = new BlindsDeviceModel({keyDown: digitalInputs[0] - 1});
    d.validate((err: any) => {
      expect(err.errors.keyDown).toBeDefined();
      done();
    });
  });

  it('should have error about keyDown, if "keyDown" are set to a port too big (more than 7)', done => {
    let d = new BlindsDeviceModel({keyDown: digitalInputs[digitalInputs.length - 1] + 1});
    d.validate((err: any) => {
      expect(err.errors.keyDown).toBeDefined();
      done();
    });
  });

  it('should have an error about keyDown, if "keyDown" are set to a string', done => {
    let d = new BlindsDeviceModel({keyDown: "Port.DI_1"});
    d.validate((err: any) => {
      expect(err.errors.keyDown).toBeDefined();
      done();
    });
  });

  it('should have no error about actorUp, if "actorUp" are set to the minimum digital outut (8)', done => {
    let d = new BlindsDeviceModel({actorUp: digitalOutputs[0]});
    d.validate((err: any) => {
      expect(err.errors.actorUp).not.toBeDefined();
      done();
    });
  });

  it('should have no error about actorUp, if "actorUp" are set to the maximal digital outut (15)', done => {
    let d = new BlindsDeviceModel({actorUp: digitalOutputs[digitalOutputs.length - 1]});
    d.validate((err: any) => {
      expect(err.errors.actorUp).not.toBeDefined();
      done();
    });
  });

  it('should have error about actorUp, if "actorUp" are set to a port too small (less than 8)', done => {
    let d = new BlindsDeviceModel({actorUp: digitalOutputs[0] - 1});
    d.validate((err: any) => {
      expect(err.errors.actorUp).toBeDefined();
      done();
    });
  });

  it('should have error about actorUp, if "actorUp" are set to a port too big (more than 15)', done => {
    let d = new BlindsDeviceModel({actorUp: digitalOutputs[digitalOutputs.length - 1] + 1});
    d.validate((err: any) => {
      expect(err.errors.actorUp).toBeDefined();
      done();
    });
  });

  it('should have an error about actorUp, if "actorUp" are set to a string', done => {
    let d = new BlindsDeviceModel({actorUp: "Port.DI_1"});
    d.validate((err: any) => {
      expect(err.errors.actorUp).toBeDefined();
      done();
    });
  });

  it('should have no error about actorDown, if "actorDown" are set to the minimum digital input (8)', done => {
    let d = new BlindsDeviceModel({actorDown: digitalOutputs[0]});
    d.validate((err: any) => {
      expect(err.errors.actorDown).not.toBeDefined();
      done();
    });
  });

  it('should have no error about actorDown, if "actorDown" are set to the maximal analog input (15)', done => {
    let d = new BlindsDeviceModel({actorDown: digitalOutputs[digitalOutputs.length - 1]});
    d.validate((err: any) => {
      expect(err.errors.actorDown).not.toBeDefined();
      done();
    });
  });

  it('should have error about actorDown, if "actorDown" are set to a port too small (less than 8)', done => {
    let d = new BlindsDeviceModel({actorDown: digitalOutputs[0] - 1});
    d.validate((err: any) => {
      expect(err.errors.actorDown).toBeDefined();
      done();
    });
  });

  it('should have error about actorDown, if "actorDown" are set to a port too big (more than 15)', done => {
    let d = new BlindsDeviceModel({actorDown: digitalOutputs[digitalOutputs.length - 1] + 1});
    d.validate((err: any) => {
      expect(err.errors.actorDown).toBeDefined();
      done();
    });
  });

  it('should have an error about actorDown, if "actorDown" are set to a string', done => {
    let d = new BlindsDeviceModel({actorDown: "Port.DI_1"});
    d.validate((err: any) => {
      expect(err.errors.actorDown).toBeDefined();
      done();
    });
  });

  it('should be valid if is name and port are set with valid values', done => {
    let d = new BlindsDeviceModel({
      name: "abcde",
      keyUp: digitalInputs[0],
      keyDown: digitalInputs[1],
      actorUp: digitalOutputs[0],
      actorDown: digitalOutputs[0],
      runningSeconds: 15
    });
    d.validate((err: any) => {
      expect(err).toBeNull();
      done();
    });
  });
});
