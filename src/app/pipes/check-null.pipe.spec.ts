import { CheckNullPipe } from './check-null.pipe';

describe('CheckNullPipe', () => {
  it('create an instance', () => {
    const pipe = new CheckNullPipe();
    expect(pipe).toBeTruthy();
  });
});
