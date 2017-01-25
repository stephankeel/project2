import {Document} from 'mongoose';
import {IDevice} from '../entities/device.interface';

export interface IDeviceDocument extends IDevice, Document {
}
