import {logger} from '../utils/logger';
import {Document, Schema, Model, model} from 'mongoose';
import {IBlindsDevice} from '../entities/device.interface';
import {digitalInputs, digitalOutputs} from '../hardware/port-map';

export interface IBlindsDeviceModel extends IBlindsDevice, Document {
}
;

export let BlindsDeviceSchema = new Schema({
  id: String,
  name: {type: String, required: true, minlength:4, unique: true},
  keyUp: {type: Number, required: true, min: digitalInputs[0], max:digitalInputs[digitalInputs.length],  unique: true},
  keyDown: {type: Number, required: true, min: digitalInputs[0], max:digitalInputs[digitalInputs.length],  unique: true},
  actorUp: {type: Number, required: true, min: digitalOutputs[0], max:digitalOutputs[digitalOutputs.length],  unique: true},
  actorDown: {type: Number, required: true, min: digitalOutputs[0], max:digitalOutputs[digitalOutputs.length],  unique: true},
  runningSeconds: {type: Number, required: true, min: 10, max: 120}
}, {
  versionKey: false, // avoids __v, i.e. the version key
});

/*
 BlindsDeviceSchema.pre('save', (next) => {
 // TODO: Pre save validation
 next();
 });
 */

export const BlindsDevice: Model<IBlindsDeviceModel> = model<IBlindsDeviceModel>('BlindsDevice', BlindsDeviceSchema);
