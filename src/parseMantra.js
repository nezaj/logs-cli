import fs from 'fs';

// Main methods
// ---------------------------------------------------------------------------
export function parseMantra(filePath) {
  return fs.readFileSync(filePath, 'utf8')
    .split(/### Day \d+/).slice(1) // Identify mantra blocks
    .map(extractMantra)
    .reduce((a, b) => nextMantra(a, b), {})
}

// Constants
// ---------------------------------------------------------------------------
const MANTRA_MAP = {
  'Woke up Early'   : 'wake_up',
  'Solid Exercise'  : 'exercise',
  'Did Good Work'   : 'good_work',
  'Under 2000'      : 'under_2000',
  'Clean'           : 'cleans'
}

// Helper methods
// ---------------------------------------------------------------------------
export function extractMantra(logBlock) {
  const date = extractMantraDate(logBlock)
  const mantra = extractMantraInfo(logBlock)
  const notes = extractMantraNotes(logBlock)
  return {date, mantra, notes}
}

export function extractMantraDate(logBlock) {
  return logBlock.split('\n')[0].match(/\d{2}\/\d{2}\/\d{2}/)[0]
}

export function extractMantraInfo(logBlock) {
  // Extract raw mantra flags
  const startIdx = logBlock.indexOf('Mantra:');
  const endIdx = logBlock.indexOf('Notes:') - 2;
  let mantra = logBlock.slice(startIdx, endIdx).split('\n')
    .slice(1) // Remove header
    .map(parseMantraLine)
    .reduce((a, b) => { a[b[0]] = b[1]; return a }, {})

  // Use individual flags to append clean flag
  const flags = Object.keys(mantra).map(key => mantra[key])
  mantra['Clean'] = flags.every(x => x === 'Y') ? 'Y' : 'N'

  return mantra
}

export function extractMantraNotes(logBlock) {
  const startIdx = logBlock.indexOf('Notes:')
  const endIdx = -2; // Expecting last line to be a newline, so go to 2nd last
  return logBlock.slice(startIdx, endIdx).split('\n')
    .slice(1) // Remove header
    .map(x => x.replace('* ', '').trim())
}

export function nextMantra(mantra, entry) {
  let clone = Object.assign({}, mantra);

  // Initialize mantra object if it is empty
  if (Object.keys(clone).length === 0) {
    clone['wake_up'] = []
    clone['cleans'] = []
    clone['exercise'] = []
    clone['good_work'] = []
    clone['under_2000'] = []
    clone['notes'] = []
  }

  // Add mantra keys
  Object.keys(entry.mantra).forEach(x => {
    const k = MANTRA_MAP[x]
    // Only push whitelisted keys
    if (k) {
      const v = {'date': entry.date, 'flag': entry.mantra[x]}
      clone[k].push(v)
    }
  })

  // Add notes
  clone.notes.push({'date': entry.date, 'values': entry.notes})

  return clone
}

export function parseMantraLine(mantraLine) {
  const [k, v] = mantraLine.split(':')
  return [k.replace('* ', '').trim(), v.trim()]
}
