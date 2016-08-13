import {expect} from 'chai';

import {
  extractMantra,
  extractMantraDate,
  extractMantraInfo,
  extractMantraNotes,
  parseMantraLine
} from '../src/parseMantra';

describe('parseMantra:', () => {
  describe('extractMantra --', () => {
    it('returns a mantra object rom a logblock', () => {
      const logBlock = '' +
        ' (Friday): 07/29/16\n' +
        'Mantra:\n' +
        '* Woke up Early   : N\n' +
        '* Solid Exercise  : N\n' +
        '* Did Good Work   : Y\n' +
        '* Under 2000      : Y\n' +
        '\n' +
        'Notes:\n' +
        '* Getting up was rough, missed workout again\n' +
        '\n'

      expect(extractMantra(logBlock)).to.deep.equal({
        date: '07/29/16',
        mantra: {
          'Woke up Early': 'N',
          'Solid Exercise': 'N',
          'Did Good Work': 'Y',
          'Under 2000': 'Y',
          'Clean': 'N'
        },
        notes: ['Getting up was rough, missed workout again']
      });
    });
  });
  describe('extractMantraDate --', () => {
    it('returns a string representing the date from a logblock', () => {
      const logBlock = '' +
        ' (Friday): 07/29/16\n' +
        'Mantra:\n' +
        '* Woke up Early   : N\n' +
        '* Solid Exercise  : N\n' +
        '* Did Good Work   : Y\n' +
        '* Under 2000      : Y\n' +
        '\n' +
        'Notes:\n' +
        '* Getting up was rough, missed workout again\n' +
        '\n'

      expect(extractMantraDate(logBlock)).to.equal('07/29/16');
    });
  });
  describe('extractMantraInfo --', () => {
    it('returns a map of mantra flags from a logblock', () => {
      const logBlock = '' +
        ' (Friday): 07/29/16\n' +
        'Mantra:\n' +
        '* Woke up Early   : N\n' +
        '* Solid Exercise  : N\n' +
        '* Did Good Work   : Y\n' +
        '* Under 2000      : Y\n' +
        '\n' +
        'Notes:\n' +
        '* Getting up was rough, missed workout again\n' +
        '\n'

      expect(extractMantraInfo(logBlock)).to.deep.equal({
        'Woke up Early': 'N',
        'Solid Exercise': 'N',
        'Did Good Work': 'Y',
        'Under 2000': 'Y',
        'Clean': 'N'
      })
    });
  });
  describe('extractMantraNotes --', () => {
    it('returns an array of notes from a logblock', () => {
      const logBlock = '' +
        ' (Friday): 07/29/16\n' +
        'Mantra:\n' +
        '* Woke up Early   : N\n' +
        '* Solid Exercise  : N\n' +
        '* Did Good Work   : Y\n' +
        '* Under 2000      : Y\n' +
        '\n' +
        'Notes:\n' +
        '* Getting up was rough, missed workout again\n' +
        '\n'

      expect(extractMantraNotes(logBlock)).to.deep.equal([
        'Getting up was rough, missed workout again'
      ])
    });
  });
  describe('parseMantraLine --', () => {
    it('returns a key-value pair from a mantra line', () => {
      const mantraLine = '* Solid Exercise  : Y'
      expect(parseMantraLine(mantraLine)).to.deep.equal([
        'Solid Exercise', 'Y'
      ]);
    });
  });
});
