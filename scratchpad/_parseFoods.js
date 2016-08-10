import repl from 'repl';

// Customize repl context
// ---------------------------------------------------------------------------
import fs from 'fs';
import path from 'path';

import {
  extractDiet,
  nextDiet,
  parseDietLine,
  formatFoods,
  shouldIncludeBlock
} from '../src/parseFoods';
import {leftpad, rightpad} from '../src/utils';

const rootPath = path.join(__dirname, '..');
const filePath = 'test/data/fitness.md';
const dataFile = path.join(rootPath, filePath);

const start = new Date('01/01/16');
const end = new Date('01/01/17');

const outPath = path.join(rootPath, 'test/data/fitness_output.md');
const expected = fs.readFileSync(outPath, 'utf8')

const foods = fs.readFileSync(filePath, 'utf8')
      .replace(/### Day/gi, '(REPLACE ME)### Day')
      .split('(REPLACE ME)').slice(1)
      .filter(x => shouldIncludeBlock(x, start, end))
      .map(extractDiet).reduce((a,b) => a.concat(b))
      .map(parseDietLine)
      .reduce(nextDiet, {});

// Sort by total calories and then alphabetical order for ties
const sortedFoods = Object.keys(foods)
        .sort((a, b) => {
          return foods[b].calories > foods[a].calories ?
            1 : foods[b].calories < foods[a].calories ?
              -1 : foods[a].name > foods[b].name
        })
        .map(x => foods[x]);

const pfoods = formatFoods(sortedFoods);

function initializeContext(context) {
  context.exp = expected;
  context.foods = foods;
  context.sfoods = sortedFoods;
  context.pfoods = pfoods;
}

// Start repl
// ---------------------------------------------------------------------------
const r = repl.start({
  prompt: "parse-logs > ",
});
initializeContext(r.context);

r.on('reset', initializeContext);
