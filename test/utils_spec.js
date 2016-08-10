import assert from 'assert';

import {isDateBetween} from '../src/utils';

describe('utils:', () => {
  describe('isDateBetween --', () => {
    it('returns true if date is between start and end', () => {
      const check = new Date('01/02/16');
      const start = new Date('01/01/16');
      const end = new Date('01/01/17');
      assert.ok(isDateBetween(check, start, end));
    })
    it('returns false if date is not between start and end', () => {
      const check = new Date('01/02/17');
      const start = new Date('01/01/16');
      const end = new Date('01/01/17');
      assert.ok(!isDateBetween(check, start, end));
    })
  });
});
