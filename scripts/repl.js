/* Bootstrapped repl for rapid prototyping */
const repl = require('repl')

// Customize repl context
// ---------------------------------------------------------------------------
const fs = require('fs');
const path = require('path');

const rootPath = path.join(__dirname, '..')
const filePath = 'test/data/two_days.md'
const dataFile = path.join(rootPath, filePath)
const contents = fs.readFileSync(dataFile, 'utf8')

function initializeContext(context) {
  context.x = contents;
}

// Start repl
// ---------------------------------------------------------------------------
const r = repl.start({
  prompt: "parse-logs > ",
})
initializeContext(r.context);

r.on('reset', initializeContext);
