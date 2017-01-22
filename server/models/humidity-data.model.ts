'user strict';

import {Document, Schema, Model, model} from 'mongoose';
import {IHumidityData} from '../entities/data.interface';

export interface IHumidityDataModel extends IHumidityData, Document {};

export let HumidityDataSchema = new Schema({
  deviceId: {type: String, required: true},
  timestamp: {type: Number, required: true},
  value: {type: Number, required: true}
}, {
  versionKey: false, // avoids __v, i.e. the version key
});

export const HumidityData: Model<IHumidityDataModel> = model<IHumidityDataModel>('HumidityData', HumidityDataSchema);
