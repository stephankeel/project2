import { UserListFormatterPipe } from './user-list-formatter.pipe';

describe('UserListFormatterPipe', () => {
  it('create an instance', () => {
    const pipe = new UserListFormatterPipe();
    expect(pipe).toBeTruthy();
  });
});
