import {Document, Schema, Model, model} from 'mongoose';
import {IHumidityData} from '../entities/data.interface';

export interface IHumidityDataDocument extends IHumidityData, Document {
}

let HumidityDataSchema = new Schema({
  id: String,
  deviceId: {type: String, required: true, index: true},
  timestamp: {type: Number, required: true},
  value: {type: Number, required: true}
}, {
  versionKey: false, // avoids __v, i.e. the version key
});

export const HumidityDataModel: Model<IHumidityDataDocument> = model<IHumidityDataDocument>('HumidityData', HumidityDataSchema);
