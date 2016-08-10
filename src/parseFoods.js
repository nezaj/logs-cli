const fs = require('fs');

export function parseFoods (filePath) {
  const start = new Date('01/01/16');
  const end = new Date('01/01/17');

  // Initialize dictionary of foods keyed into info
  let foods = {};

  // Identify blocks of diet info
  let blocks = fs.readFileSync(filePath, 'utf8');
  blocks.replace(/### Day/gi, '(REPLACE ME)### Day')
      .split('(REPLACE ME)')
      .filter(x => x !== '')
      .filter(x => shouldIncludeBlock(x, start, end))

  // For each block --> idea is to create an array of diet objects
    // extractDiet
    // parseDiet line by line
    // push diet objects into array

  // Reduce diet objects into dictionary
  // Return dictionary formatted as string
}

export function shouldIncludeBlock (logBlock, startDate, endDate) {
  const logHeader = logBlock.split('\n')[0].match(/\d{2}\/\d{2}\/\d{2}/)
  if (logHeader) {
    const logDate = new Date(logHeader[0]);
    return isDateBetween(logDate, startDate, endDate)
  }
}

export function extractDiet (logBlock) {
  const startIdx = logBlock.indexOf('Diet: ');
  const endIdx = logBlock.indexOf('Exercise: ') - 2;
  const nested = logBlock.substring(startIdx, endIdx)
                         .split('\n')
                         .slice(1) // Remove diet header row
                         .map(x => x.replace('* ', '') // replace bullets
                                    .split('+') // split lines by foods
                                    .map(x => x.trim()))
  return [].concat.apply([], nested)
}

export function isDateBetween (check, start, end) {
  return check >= start && check <= end;
}

export function parseLine (line) {
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
  calVal = parseInt(_f.substring(_f.indexOf('(') + 1, _f.indexOf(')')), 10)

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
