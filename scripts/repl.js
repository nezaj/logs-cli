/* Bootstrapped repl for rapid prototyping */
import repl from 'repl';

// Common imports I seem to use a lot
import fs from 'fs';
import path from 'path';

// Customize repl context
// ---------------------------------------------------------------------------
import {parseMantra} from '../src/parseMantra';

const rootPath = path.join(__dirname, '..');
const mantraInPath = path.join(rootPath, 'test/data/mantra.md');
const mantra = parseMantra(mantraInPath)

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

function initializeContext(context) {
  context.x = mantra;
  context.lb = logBlock;
}

// Start repl
// ---------------------------------------------------------------------------
const r = repl.start({
  prompt: "parse-logs > ",
})
initializeContext(r.context);

r.on('reset', initializeContext);
