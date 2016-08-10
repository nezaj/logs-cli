import assert from 'assert';
import fs from 'fs';
import path from 'path';

import {parseFoods} from '../src/parseFoods';

const rootPath = path.join(__dirname, '..');
const inPath = path.join(rootPath, 'test/data/fitness.md');
const outPath = path.join(rootPath, 'test/data/fitness_output.md');

describe('acceptance:', () => {
  describe('parseFoods --', () => {
    it('Returns table of foods with info for a file', () => {
      const start = new Date('01/01/16');
      const end = new Date('01/01/17');
      const expected = fs.readFileSync(outPath, 'utf8')
      const actual = parseFoods(inPath, start, end);
      assert.equal(actual, expected);
    })
  });
});
