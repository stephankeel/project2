import { NotEmptyPipe } from './not-empty.pipe';

describe('NotEmptyPipe', () => {
  it('create an instance', () => {
    const pipe = new NotEmptyPipe();
    expect(pipe).toBeTruthy();
  });
});
