import {TemperatureListitemFormatterPipe} from './temperature-listitem-formatter.pipe';
import {ITemperatureDevice} from "../../../../../server/entities/device.interface";

describe('TemperatureListitemFormatterPipe', () => {
  it('create an instance', () => {
    const pipe = new TemperatureListitemFormatterPipe();
    expect(pipe).toBeTruthy();
  });
  it('test name attribute of IBlindsData', () => {
    const pipe = new TemperatureListitemFormatterPipe();
    let temperatureDevice: ITemperatureDevice = {name: "name1"};
    expect(pipe.transform(temperatureDevice)).toEqual("name1");
  });
  it('test empty IBlindsData', () => {
    const pipe = new TemperatureListitemFormatterPipe();
    let temperatureDevice: ITemperatureDevice = {};
    expect(pipe.transform(temperatureDevice)).toBeUndefined();
  });
  it('test null', () => {
    const pipe = new TemperatureListitemFormatterPipe();
    expect(pipe.transform(null)).toBeNull();
  });
});
