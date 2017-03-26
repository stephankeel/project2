import {EmptyArrayPipe} from './empty-array.pipe';

describe('EmptyArrayPipe', () => {
  it('create an instance', () => {
    const pipe = new EmptyArrayPipe();
    expect(pipe).toBeTruthy();
  });
  it('test empty array', () => {
    const pipe = new EmptyArrayPipe();
    expect(pipe.transform([])).toBeTruthy();
  });
  it('test not empty array', () => {
    const pipe = new EmptyArrayPipe();
    expect(pipe.transform([1, 2])).toBeFalsy();
  });
  it('test null', () => {
    const pipe = new EmptyArrayPipe();
    expect(pipe.transform(null)).toBeFalsy();
  });
});
