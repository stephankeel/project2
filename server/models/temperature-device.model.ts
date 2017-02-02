import {logger} from '../utils/logger';
import {Document, Schema, Model, model} from 'mongoose';
import {ITemperatureDevice} from '../entities/device.interface';
import {analogInputs, Port} from '../hardware/port-map';

export interface ITemperatureDeviceDocument extends ITemperatureDevice, Document {
}

let TemperatureDeviceSchema = new Schema({
  id: String,
  name: {type: String, required: true, minlength: 4, unique: true},
  port: {type: Number, required: true, min: analogInputs[0], max: analogInputs[analogInputs.length - 1], unique: true},
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

export function initTemperatureDeviceWohnzimmer() {
  let name: string = 'Wohnzimmer';
  let selector = {'name': name};
  TemperatureDeviceModel.find(selector, (err, temperatureDevices) => {
    if (temperatureDevices.length) {
      logger.info(`tempteratureDevice 'Wohnzimmer' is ok. id = ${temperatureDevices[0]._id}`);
      return;
    }

    let temperatureDevice: ITemperatureDeviceDocument = new TemperatureDeviceModel();

    temperatureDevice.name = name;
    temperatureDevice.port = Port.AI_1;
    logger.info(`creating temperatureDevice 'Wohnzimmer': ${JSON.stringify(temperatureDevice)}`);
    temperatureDevice.save((err: any, temperatureDevice: ITemperatureDeviceDocument) => {
      if (err) {
        throw new Error(err);
      } else {
        logger.info(`temperatureDevice 'Wohnzimmer' created successfully: ${temperatureDevice}`)
      }
    });
  });
}
