import {Document, Schema, Model, model} from 'mongoose';
import {IHumidityDevice} from '../entities/device.interface';
import {analogInputs} from '../hardware/port-map';

export interface IHumidityDeviceDocument extends IHumidityDevice, Document {
}

let HumidityDeviceSchema = new Schema({
  id: String,
  name: {type: String, required: true, minlength: 4, unique: true},
  port: {type: Number, required: true, min: analogInputs[0], max: analogInputs[analogInputs.length - 1], unique: true},
}, {
  versionKey: false, // avoids __v, i.e. the version key
});

/*
 HumidityDeviceSchema.pre('save', (next) => {
 // TODO: Pre save validation
 next();
 });
 */

export const HumidityDeviceModel: Model<IHumidityDeviceDocument> = model<IHumidityDeviceDocument>('HumidityDevice', HumidityDeviceSchema);
