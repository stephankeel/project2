import {TimestampFormatterPipe} from './timestamp-formatter.pipe';

describe('TimestampFormatterPipe', () => {
  it('create an instance', () => {
    const pipe = new TimestampFormatterPipe();
    expect(pipe).toBeTruthy();
  });
  it('test value not null', () => {
    const pipe = new TimestampFormatterPipe();
    const timestamp: number = 100;
    const expectedFormat: string = new Date(timestamp).toLocaleTimeString();
    expect(pipe.transform(timestamp)).toEqual(expectedFormat);
  });
  it('test value null', () => {
    const pipe = new TimestampFormatterPipe();
    expect(pipe.transform(null)).toEqual("time missing");
  });
});
