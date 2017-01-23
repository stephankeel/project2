'user strict';

import {Document, Schema, Model, model} from 'mongoose';
import {IBlindsData} from '../entities/data.interface';
import {blindsStateValues} from '../entities/blinds-state';

export interface IBlindsDataDocument extends IBlindsData, Document {};

let BlindsDataSchema = new Schema({
  deviceId: {type: String, required: true},
  timestamp: {type: Number, required: true},
  state: {type: Number, required: true, min: blindsStateValues[0], max: blindsStateValues[blindsStateValues.length]},
}, {
  versionKey: false, // avoids __v, i.e. the version key
});

export const BlindsDataModel: Model<IBlindsDataDocument> = model<IBlindsDataDocument>('BlindsData', BlindsDataSchema);
