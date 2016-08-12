import {expect} from 'chai';

import {
  extractDiet,
  formatFoods,
  nextDiet,
  parseDietLine,
  shouldIncludeBlock,
  sortFoods
} from '../src/parseFoods';

describe('parseFoods:', () => {
  describe('extractDiet --', () => {
    it('returns list of diet lines from a logblock', () => {
      const logBlock = '' +
        '### Day 168 (Sunday): 07/17/16\n' +
        'Weight:\n' +
        '* Morning: 154.4\n' +
        '\n' +
        'Diet: 1990, 48g\n' +
        '* 4 Fruit Bars (450)\n' +
        '* Fruit Juice (280) + OJ (240)\n' +
        '* FF Cottage Cheese (240) + Flaxseed (200), 48g\n' +
        '* Apple (80)\n' +
        '* Coronita (80) + Wine (120)\n' +
        '* Carrots (150) + Fruit (150)\n' +
        '\n' +
        'Exercise: Cardio\n' +
        '* Marathon Training: 26.2mi, 4:28:53 -- 10:11/mi pace\n' +
        '\n' +
        'Notes:\n' +
        '* Woke up ~8am\n' +
        '* Ran a full marathon, pace was a little slow, but proud to finish it\n' +
        '6 Needed to soak in tub, and eat lots of carbs after run\n' +
        '* Hung out w/ Jiu-Jitsu crew after, very chill\n' +
        '* Went to bed early\n'

      expect(extractDiet(logBlock)).to.deep.equal([
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

  describe('formatFoods --', () => {
    it('formats sorted foods as expected', () => {
      const sortedFoods = [
        { name: 'Turkey Balls', count: 2, calories: 700, protein: 42 },
        { name: 'Fruit Bars', count: 4, calories: 450, protein: 0 },
        { name: 'Flaxseed', count: 2, calories: 400, protein: 69 },
        { name: 'Oatmeal', count: 1, calories: 340, protein: 0 },
        { name: 'Apple', count: 3, calories: 280, protein: 0 },
        { name: 'Fruit Juice', count: 1, calories: 280, protein: 0 },
        { name: 'Mandarins', count: 2, calories: 280, protein: 0 },
        { name: 'Carrots', count: 2, calories: 250, protein: 42 },
        { name: 'FF Cottage Cheese', count: 1, calories: 240, protein: 0 },
        { name: 'OJ', count: 1, calories: 240, protein: 0 },
        { name: 'Fruit', count: 1, calories: 150, protein: 0 },
        { name: 'Protein Powder', count: 1, calories: 120, protein: 25 },
        { name: 'Wine', count: 1, calories: 120, protein: 0 },
        { name: 'Coronita', count: 1, calories: 80, protein: 0 }
      ];

      expect(formatFoods(sortedFoods)).to.deep.equal('' +
        'Foods: 14 unique, 23 total, 3930 calories\n' +
        '* Turkey Balls      : 2   (700),  17.8%,   17.8%\n' +
        '* Fruit Bars        : 4   (450),  11.5%,   29.3%\n' +
        '* Flaxseed          : 2   (400),  10.2%,   39.4%\n' +
        '* Oatmeal           : 1   (340),   8.7%,   48.1%\n' +
        '* Apple             : 3   (280),   7.1%,   55.2%\n' +
        '* Fruit Juice       : 1   (280),   7.1%,   62.3%\n' +
        '* Mandarins         : 2   (280),   7.1%,   69.5%\n' +
        '* Carrots           : 2   (250),   6.4%,   75.8%\n' +
        '* FF Cottage Cheese : 1   (240),   6.1%,   81.9%\n' +
        '* OJ                : 1   (240),   6.1%,   88.0%\n' +
        '* Fruit             : 1   (150),   3.8%,   91.9%\n' +
        '* Protein Powder    : 1   (120),   3.1%,   94.9%\n' +
        '* Wine              : 1   (120),   3.1%,   98.0%\n' +
        '* Coronita          : 1    (80),   2.0%,  100.0%\n'
      );
    });
  });

  describe('nextDiet --', () => {
    it('adds entry for new food', () => {
      let diet = {};
      const entry = { name: 'Flaxseed', count: 1, calories: 200, protein: 48 }
      expect(nextDiet(diet, entry)).to.deep.equal({
        'Flaxseed': { name: 'Flaxseed', count: 1, calories: 200, protein: 48 }
      });
    });
    it('adds updates entry for existing food', () => {
      let diet = { 'Flaxseed' : { name: 'Flaxseed', count: 1, calories: 200, protein: 48 } }
      const entry = { name: 'Flaxseed', count: 2, calories: 400, protein: 96  }
      expect(nextDiet(diet, entry)).to.deep.equal({
        'Flaxseed': { name: 'Flaxseed', count: 3, calories: 600, protein: 144 }
      });
    });
    it('does not modify original diet object', () => {
      let diet = {};
      const entry = { name: 'Flaxseed', count: 2, calories: 400, protein: 96  }
      nextDiet(diet, entry)
      expect(diet).to.be.empty;
    });
  });

  describe('parseDietLine --', () => {
    it('Parses food without count and protein', () => {
      const line = 'Flaxseed (200)'
      expect(parseDietLine(line)).to.deep.equal({
        name: 'Flaxseed',
        count: 1,
        calories: 200,
        protein: 0
      });
    })
    it('Parses food with count', () => {
      const line = '2 Flaxseed (200)'
      expect(parseDietLine(line)).to.deep.equal({
        name: 'Flaxseed',
        count: 2,
        calories: 200,
        protein: 0
      });
    })
    it('Parses food with count and protein', () => {
      const line = '2 Flaxseed (200), 48g'
      expect(parseDietLine(line)).to.deep.equal({
        name: 'Flaxseed',
        count: 2,
        calories: 200,
        protein: 48
      });
    })
  });

  describe('shouldIncludeBlock --', () => {
    it('returns true if block is between start and end', () => {
      const logBlock = '### Day 168 (Sunday): 07/17/16\nWeight:\n*'
      const start = new Date('01/01/16');
      const end = new Date('01/01/17');
      expect(shouldIncludeBlock(logBlock, start, end)).to.be.true;
    })
    it('returns false if block is not between start and end', () => {
      const logBlock = '### Day 168 (Sunday): 07/17/17\nWeight:\n*'
      const start = new Date('01/01/16');
      const end = new Date('01/01/17');
      expect(shouldIncludeBlock(logBlock, start, end)).to.be.false;
    })
  });

  describe('sortFoods --', () => {
    it('sorts by total calories', () => {
      const foods = {
        'Fruit Bars': { name: 'Fruit Bars', count: 4, calories: 450, protein: 0 },
        'Fruit Juice': { name: 'Fruit Juice', count: 1, calories: 280, protein: 0 },
        OJ: { name: 'OJ', count: 1, calories: 240, protein: 0 },
        'FF Cottage Cheese': { name: 'FF Cottage Cheese', count: 1, calories: 240, protein: 0 },
        Flaxseed: { name: 'Flaxseed', count: 2, calories: 400, protein: 69 },
        Apple: { name: 'Apple', count: 3, calories: 280, protein: 0 },
        Coronita: { name: 'Coronita', count: 1, calories: 80, protein: 0 },
        Wine: { name: 'Wine', count: 1, calories: 120, protein: 0 },
        Carrots: { name: 'Carrots', count: 2, calories: 250, protein: 42 },
        Fruit: { name: 'Fruit', count: 1, calories: 150, protein: 0 },
        Oatmeal: { name: 'Oatmeal', count: 1, calories: 340, protein: 0 },
        'Protein Powder': { name: 'Protein Powder', count: 1, calories: 120, protein: 25 },
        Mandarins: { name: 'Mandarins', count: 2, calories: 280, protein: 0 },
        'Turkey Balls': { name: 'Turkey Balls', count: 2, calories: 700, protein: 42 }
      };

      expect(sortFoods(foods)).to.deep.equal([
        { name: 'Turkey Balls', count: 2, calories: 700, protein: 42 },
        { name: 'Fruit Bars', count: 4, calories: 450, protein: 0 },
        { name: 'Flaxseed', count: 2, calories: 400, protein: 69 },
        { name: 'Oatmeal', count: 1, calories: 340, protein: 0 },
        { name: 'Apple', count: 3, calories: 280, protein: 0 },
        { name: 'Fruit Juice', count: 1, calories: 280, protein: 0 },
        { name: 'Mandarins', count: 2, calories: 280, protein: 0 },
        { name: 'Carrots', count: 2, calories: 250, protein: 42 },
        { name: 'FF Cottage Cheese', count: 1, calories: 240, protein: 0 },
        { name: 'OJ', count: 1, calories: 240, protein: 0 },
        { name: 'Fruit', count: 1, calories: 150, protein: 0 },
        { name: 'Protein Powder', count: 1, calories: 120, protein: 25 },
        { name: 'Wine', count: 1, calories: 120, protein: 0 },
        { name: 'Coronita', count: 1, calories: 80, protein: 0 }
      ]);
    })
  });
});
