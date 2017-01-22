'user strict';

import {Document, Schema, Model, model} from 'mongoose';
import {ITemperatureData} from '../entities/data.interface';

export interface ITemperatureDataModel extends ITemperatureData, Document {};

export let TemperatureDataSchema = new Schema({
  deviceId: {type: String, required: true},
  timestamp: {type: Number, required: true},
  value: {type: Number, required: true}
}, {
  versionKey: false, // avoids __v, i.e. the version key
});

export const TemperatureData: Model<ITemperatureDataModel> = model<ITemperatureDataModel>('TemperatureData', TemperatureDataSchema);
