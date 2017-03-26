import {ValueSplitPipe} from './value-split.pipe';

describe('ValueSplitPipe', () => {
  it('create an instance', () => {
    const pipe = new ValueSplitPipe();
    expect(pipe).toBeTruthy();
  });
  it('test null', () => {
    const pipe = new ValueSplitPipe();
    expect(pipe.transform(null)).toBeNull();
  });
  it('test value without option', () => {
    const pipe = new ValueSplitPipe();
    expect(pipe.transform(4.444)).toEqual(4.444);
  });
  it('test value with option = 0', () => {
    const pipe = new ValueSplitPipe();
    expect(pipe.transform(4.444, 0)).toEqual(4.444);
  });
  it('test value < ?.5 with option > 0', () => {
    const pipe = new ValueSplitPipe();
    expect(pipe.transform(4.444, 1)).toEqual(4);
  });
  it('test value > ?.5 with option > 0', () => {
    const pipe = new ValueSplitPipe();
    expect(pipe.transform(4.999, 1)).toEqual(4);
  });
  it('test value (with one decimal value) with option < 0', () => {
    const pipe = new ValueSplitPipe();
    expect(pipe.transform(3.4, -1)).toEqual(4);
  });
  it('test value (with two decimal value, rounded down) with option < 0', () => {
    const pipe = new ValueSplitPipe();
    expect(pipe.transform(3.43, -1)).toEqual(4);
  });
  it('test value (with two decimal value, rounded up, test 1) with option < 0', () => {
    const pipe = new ValueSplitPipe();
    expect(pipe.transform(3.45, -1)).toEqual(5);
  });
  it('test value (with two decimal value, rounded up, test 2) with option < 0', () => {
    const pipe = new ValueSplitPipe();
    expect(pipe.transform(3.49, -1)).toEqual(5);
  });
});
