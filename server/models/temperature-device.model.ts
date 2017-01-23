'user strict';

import {Document, Schema, Model, model} from 'mongoose';
import {ITemperatureDevice} from '../entities/device.interface';
import {analogInputs} from '../hardware/port-map';

export interface ITemperatureDeviceDocument extends ITemperatureDevice, Document {};

let TemperatureDeviceSchema = new Schema({
  id: String,
  name: {type: String, required: true, minlength:4, unique: true},
  port: {type: Number, required: true, min: analogInputs[0], max:analogInputs[analogInputs.length], unique: true},
}, {
  versionKey: false, // avoids __v, i.e. the version key
});

/*
 TemperatureDeviceSchema.pre('save', (next) => {
 // TODO: Pre save validation
 next();
 });
 */

export const TemperatureDeviceModel: Model<ITemperatureDeviceDocument> = model<ITemperatureDeviceDocument>('TemperatureDevice', TemperatureDeviceSchema);
