import * as mongoose from "mongoose";

export interface ITemperatureItem {
  date: Date;
  value: number;
}

export interface ITemperature extends ITemperatureItem{
  id: string;
  sensorId: string;
  date: Date;
  value: number;
}

export interface ITemperatureModel extends ITemperature, mongoose.Document {
}

export var TemperatureSchema = new mongoose.Schema({
  id: {
    type: String,
    index: true
  },
  sensorId: {
    type: String,
    index: true
  },
  date: Date,
  value: String,
});

export var Message = mongoose.model<ITemperatureModel>("Temperature", TemperatureSchema);
