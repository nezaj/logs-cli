import fs from 'fs'

import { isDateBetween, leftpad, rightpad } from './utils'

// Main methods
// ---------------------------------------------------------------------------

/* Parses fitness log to give a summary of foods eaten for the time specified */
export function parseFoods(filePath, startDate, endDate) {
  const foods = fs.readFileSync(filePath, 'utf8')
          .replace(/### Day/gi, '(REPLACE ME)### Day') // label diet blocks
          .split('(REPLACE ME)').slice(1) // Extract diet blocks
          .filter(x => shouldIncludeBlock(x, startDate, endDate))
          .map(extractDiet).reduce((a, b) => a.concat(b))
          .map(parseDietLine)
          .reduce(nextDiet, {})

  return formatFoods(sortFoods(foods))
}

// Helper methods
// ---------------------------------------------------------------------------

/* Returns list of diet lines from the diet block of a log entry */
export function extractDiet(logBlock) {
  const startIdx = logBlock.indexOf('Diet: ');
  const endIdx = logBlock.indexOf('Exercise: ') - 2;
  return logBlock.slice(startIdx, endIdx)
                 .split('\n').slice(1) // Remove diet header row
                 .map(x => x.replace('* ', '') // replace bullets
                            .split('+') // split lines with multiple foods
                            .map(x => x.trim())) // remove extra white space
                 .reduce((a, b) => a.concat(b), []) // flatten foods
}

export function formatFoods(foods) {
  const uniqueFoods = foods.length;
  const longestFood = foods.reduce((a, b) => Math.max(a, b.name.length), 0);
  const totalCount = foods.reduce((a, b) => a + b.count, 0)
  const totalCalories = foods.reduce((a, b) => a + b.calories, 0)
  let runningCalories = []
  foods.reduce((a, b, i) => runningCalories[i] = a + b.calories, 0)

  // Print header
  let printed = `` +
    `Foods: ${uniqueFoods} unique, ${totalCount} total,` +
    ` ${totalCalories} calories`

  // Print foods
  foods.forEach((x, idx) => printed += `\n` +
    `* ${rightpad(x.name, longestFood)} :` +
    ` ${rightpad(x.count, 2)}` +
    ` ${leftpad('(' + x.calories, 5)}),` +
    ` ${leftpad((100 * x.calories / totalCalories).toFixed(1), 5)}%,` +
    ` ${leftpad((100 * runningCalories[idx] / totalCalories).toFixed(1), 6)}%`
  )

  // Add an extra newLine to mimc EOF behavior
  printed += '\n'

  return printed
}

/* Returns a brand new diet dictionary with the entry added */
export function nextDiet(diet, entry) {
  let clone = Object.assign({}, diet);
  if (clone[entry.name]) {
    clone[entry.name].count += entry.count;
    clone[entry.name].calories += entry.calories;
    clone[entry.name].protein += entry.protein;
  } else {
    clone[entry.name] = {
      name: entry.name,
      count: entry.count,
      calories: entry.calories,
      protein: entry.protein
    }
  }
  return clone
}

/* Returns dictionary with parsed info from a diet line  */
export function parseDietLine(line) {
  // Defaults
  let nameStr = null;
  let countVal = 1;
  let calVal = 0;
  let proteinVal = 0;

  const parsed = line.split(',');
  const _f = parsed[0];
  const _p = parsed[1];

  // Extract food name
  nameStr = _f.match(/[a-zA-Z\s]+/)[0].trim()

  // Extract count
  if (_f.match(/^[0-9]+/)) {
    countVal = parseInt(_f.match(/[0-9]+/)[0], 10)
  }

  // Extract calories
  calVal = parseInt(_f.slice(_f.indexOf('(') + 1, _f.indexOf(')')), 10)

  // Extract protein
  if (_p) {
    proteinVal = parseInt(_p.trim().split('g')[0], 10)
  }

  return {
    name: nameStr,
    count: countVal,
    calories: calVal,
    protein: proteinVal
  }
}

/* Returns boolean whether log block is the date being evaluated */
export function shouldIncludeBlock(logBlock, startDate, endDate) {
  const logHeader = logBlock.split('\n')[0].match(/\d{2}\/\d{2}\/\d{2}/)
  if (logHeader) {
    const logDate = new Date(logHeader[0]);
    return isDateBetween(logDate, startDate, endDate)
  }
}

/* Sort by total calories and then alphabetical order for ties */
export function sortFoods(foods) {
  return Object.keys(foods).sort((a, b) => {
    return foods[b].calories > foods[a].calories ?
      1 : foods[b].calories < foods[a].calories ?
        -1 : foods[a].name > foods[b].name
  }).map(x => foods[x])
}
