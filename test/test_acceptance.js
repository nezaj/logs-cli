const assert = require('assert');
const fs = require('fs');
const path = require('path');

const parseFoods = require('../src/parseFoods');

const rootPath = path.join(__dirname, '..');
const filePath = 'test/data/two_days_output.md';
const dataFile = path.join(rootPath, filePath);

describe('parseFoods', () => {
  it('Returns table of foods with info for a file', () => {
    const expected = fs.readFileSync(dataFile, 'utf8');
    const actual = parseFoods(dataFile);
    assert.equal(expected, actual);
  })
})
