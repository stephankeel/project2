import {ValuePipe} from './value.pipe';
import {IAnalogData} from '../../../../../../server/entities/data.interface';

describe('ValuePipe', () => {
  it('create an instance', () => {
    const pipe = new ValuePipe();
    expect(pipe).toBeTruthy();
  });
  it('test timestamp attribute of IAnalogData', () => {
    const pipe = new ValuePipe();
    const analogData: IAnalogData = {value: 1};
    expect(pipe.transform(analogData)).toEqual(1);
  });
  it('test empty IAnalogData', () => {
    const pipe = new ValuePipe();
    const analogData: IAnalogData = {};
    expect(pipe.transform(analogData)).toBeUndefined();
  });
  it('test null', () => {
    const pipe = new ValuePipe();
    expect(pipe.transform(null)).toBeNull();
  });
});
