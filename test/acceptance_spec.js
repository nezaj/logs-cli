import fs from 'fs';
import path from 'path';

import {expect} from 'chai';

import {parseFoods} from '../src/parseFoods';

const rootPath = path.join(__dirname, '..');

// Fitness log
const fitInPath = path.join(rootPath, 'test/data/fitness.md');
const fitOutPath = path.join(rootPath, 'test/data/fitness_output.md');

// Mantra log
const mantraInPath = path.join(rootPath, 'test/data/mantra.md');
const mantraOutPath = path.join(rootPath, 'test/data/mantra_output.json');

describe('acceptance:', () => {
  describe('parseFoods --', () => {
    it('Returns table of foods with info for a file', () => {
      const start = new Date('01/01/16');
      const end = new Date('01/01/17');
      expect(parseFoods(fitInPath, start, end)).to.equal(
        fs.readFileSync(fitOutPath, 'utf8')
      );
    })
  });
  describe.skip('parseMantra --', () => {
    it('converts mantra log to json', () => {
      expect(parseMantra(mantraInPath)).to.deep.equal(require(mantraOutPath));
    })
  });
});
