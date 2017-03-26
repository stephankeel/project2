import {NamePipe} from "./name.pipe";
import {IDevice} from "../../../../../../server/entities/device.interface";
import {isUndefined} from "util";

describe('NamePipe', () => {
  it('create an instance', () => {
    const pipe = new NamePipe();
    expect(pipe).toBeTruthy();
  });
  it('test name attribute of IDevice', () => {
    const pipe = new NamePipe();
    let device : IDevice = {name: "test"};
    expect(pipe.transform(device)).toEqual("test");
  });
  it('test empty IDevice', () => {
    const pipe = new NamePipe();
    let device : IDevice = {};
    expect(pipe.transform(device)).toBeUndefined();
  });
  it('test null', () => {
    const pipe = new NamePipe();
    expect(pipe.transform(null)).toBeNull();
  });
});
