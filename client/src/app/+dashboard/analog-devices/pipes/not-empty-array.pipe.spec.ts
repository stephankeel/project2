import {NotEmptyArrayPipe} from './not-empty-array.pipe';

describe('NotEmptyArrayPipe', () => {
  it('create an instance', () => {
    const pipe = new NotEmptyArrayPipe();
    expect(pipe).toBeTruthy();
  });
  it('test empty array', () => {
    const pipe = new NotEmptyArrayPipe();
    expect(pipe.transform([])).toBeFalsy();
  });
  it('test not empty array', () => {
    const pipe = new NotEmptyArrayPipe();
    expect(pipe.transform([1, 2])).toBeTruthy();
  });
  it('test null', () => {
    const pipe = new NotEmptyArrayPipe();
    expect(pipe.transform(null)).toBeFalsy();
  });
});
