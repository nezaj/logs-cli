const assert = require('assert');
const fs = require('fs');
const path = require('path');

// Test parseFoodsModule
// ---------------------------------------------------------------------------
const parseFoodsModule          = require('../src/parseFoods');
const extractDiet               = parseFoodsModule.extractDiet;
const isDateBetween             = parseFoodsModule.isDateBetween;
const parseFoods                = parseFoodsModule.parseFoods;
const parseLine                 = parseFoodsModule.parseLine;
const shouldIncludeBlock        = parseFoodsModule.shouldIncludeBlock;

const rootPath = path.join(__dirname, '..');
const filePath = 'test/data/two_days_output.md';
const dataFile = path.join(rootPath, filePath);

// describe('parseFoods', () => {
//   it('Returns table of foods with info for a file', () => {
//     const expected = fs.readFileSync(dataFile, 'utf8');
//     const actual = parseFoods(dataFile);
//     assert.equal(expected, actual);
//   })
// })

describe('hasDateBetween', () => {
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

describe('shouldIncludeBlock', () => {
  it('returns true if block is between start and end', () => {
    const logBlock = '### Day 168 (Sunday): 07/17/16\nWeight:\n*'
    const start = new Date('01/01/16');
    const end = new Date('01/01/17');
    assert.ok(shouldIncludeBlock(logBlock, start, end));
  })
  it('returns false if block is not between start and end', () => {
    const logBlock = '### Day 168 (Sunday): 07/17/17\nWeight:\n*'
    const start = new Date('01/01/16');
    const end = new Date('01/01/17');
    assert.ok(!shouldIncludeBlock(logBlock, start, end));
  })
});

describe('parseLine', () => {
  it('Parses food without count and protein', () => {
    const line = 'Flaxseed (200)'
    assert.deepEqual(parseLine(line), {
      name: 'Flaxseed',
      count: 1,
      calories: 200,
      protein: 0
    });
  })
  it('Parses food with count', () => {
    const line = '2 Flaxseed (200)'
    assert.deepEqual(parseLine(line), {
      name: 'Flaxseed',
      count: 2,
      calories: 200,
      protein: 0
    });
  })
  it('Parses food with count and protein', () => {
    const line = '2 Flaxseed (200), 48g'
    assert.deepEqual(parseLine(line), {
      name: 'Flaxseed',
      count: 2,
      calories: 200,
      protein: 48
    });
  })
});

describe('extractDiet', () => {
  it('parses foods from a block correctly', () => {
    const logBlock =
'### Day 168 (Sunday): 07/17/16\nWeight:\n* Morning: 154.4\n\nDiet: 1990, 48g\n* 4 Fruit Bars (450)\n* Fruit Juice (280) + OJ (240)\n* FF Cottage Cheese (240) + Flaxseed (200), 48g\n* Apple (80)\n* Coronita (80) + Wine (120)\n* Carrots (150) + Fruit (150)\n\nExercise: Cardio\n* Marathon Training: 26.2mi, 4:28:53 -- 10:11/mi pace\n\nNotes:\n* Woke up ~8am\n* Ran a full marathon, pace was a little slow, but proud to finish it\n* Needed to soak in tub, and eat lots of carbs after run\n* Hung out w/ Jiu-Jitsu crew after, very chill\n* Went to bed early\n\n'
    assert.deepEqual(extractDiet(logBlock), [
      '4 Fruit Bars (450)',
      'Fruit Juice (280)',
      'OJ (240)',
      'FF Cottage Cheese (240)',
      'Flaxseed (200), 48g',
      'Apple (80)',
      'Coronita (80)',
      'Wine (120)',
      'Carrots (150)',
      'Fruit (150)'
    ]);
  })
});
