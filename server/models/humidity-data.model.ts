import {Document, Schema, Model, model} from 'mongoose';
import {IAnalogData} from '../entities/data.interface';

export interface IHumidityDataDocument extends IAnalogData, Document {
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
