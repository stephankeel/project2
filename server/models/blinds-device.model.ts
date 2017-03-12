import {Document, Schema, Model, model} from 'mongoose';
import {IBlindsDevice} from '../entities/device.interface';
import {digitalInputs, digitalOutputs} from '../hardware/port-map';

export interface IBlindsDeviceDocument extends IBlindsDevice, Document {
}

let BlindsDeviceSchema = new Schema({
  id: String,
  name: {type: String, required: true, minlength: 4, maxlength: 20, unique: true},
  keyUp: {
    type: Number,
    required: true,
    min: digitalInputs[0],
    max: digitalInputs[digitalInputs.length - 1],
    unique: true
  },
  keyDown: {
    type: Number,
    required: true,
    min: digitalInputs[0],
    max: digitalInputs[digitalInputs.length - 1],
    unique: true
  },
  actorUp: {
    type: Number,
    required: true,
    min: digitalOutputs[0],
    max: digitalOutputs[digitalOutputs.length - 1],
    unique: true
  },
  actorDown: {
    type: Number,
    required: true,
    min: digitalOutputs[0],
    max: digitalOutputs[digitalOutputs.length - 1],
    unique: true
  },
  runningSeconds: {type: Number, required: true, min: 10, max: 300}
}, {
  versionKey: false, // avoids __v, i.e. the version key
});

BlindsDeviceSchema.pre('validate', function (next) {
  if (this.keyUp != null && this.keyDown != null && this.keyUp === this.keyDown) {
    next(Error(`keyUp and keyDown must not share same port ${this.keyUp}`));
  } else if (this.actorUp != null && this.actorDown != null && this.actorUp === this.actorDown) {
    next(Error(`actorUp and actorDown must not share same port ${this.actorUp}`));
  } else {
    next();
  }
});


/*
 BlindsDeviceSchema.pre('save', (next) => {
 // TODO: Pre save validation
 next();
 });
 */

export const BlindsDeviceModel: Model<IBlindsDeviceDocument> = model<IBlindsDeviceDocument>('BlindsDevice', BlindsDeviceSchema);
