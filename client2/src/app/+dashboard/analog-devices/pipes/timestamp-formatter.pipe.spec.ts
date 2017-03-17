import { TimestampFormatterPipe } from './timestamp-formatter.pipe';

describe('TimestampFormatterPipe', () => {
  it('create an instance', () => {
    const pipe = new TimestampFormatterPipe();
    expect(pipe).toBeTruthy();
  });
});
