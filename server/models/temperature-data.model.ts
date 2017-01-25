import {Document, Schema, Model, model} from 'mongoose';
import {ITemperatureData} from '../entities/data.interface';

export interface ITemperatureDataDocument extends ITemperatureData, Document {
}

let TemperatureDataSchema = new Schema({
  // TODO: brauchen wir hier noch eine id ?
  deviceId: {type: String, required: true, index: true},
  timestamp: {type: Number, required: true},
  value: {type: Number, required: true}
}, {
  versionKey: false, // avoids __v, i.e. the version key
});

export const TemperatureDataModel: Model<ITemperatureDataDocument> = model<ITemperatureDataDocument>('TemperatureData', TemperatureDataSchema);
