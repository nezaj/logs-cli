/* Bootstrapped repl for rapid prototyping */
import repl from 'repl';

// Customize repl context
// ---------------------------------------------------------------------------
import program from 'commander'

program
  .description('Output table of foods from fitness logs')
  .usage('babel-node scripts/parseFoods.js <logFile> [options]')
  .option('-l, --last <date>', 'last date')
  .option('-d, --days <int>', '# of days to look back, defaults to 6', 6)
  .parse(process.argv)

let endDate = program.last && new Date(program.last) || new Date();
let startDate = new Date().setDate(endDate.getDate() - program.days)
endDate.setHours(0, 0, 0, 0)
startDate.setHours(0, 0, 0, 0)

function initializeContext(context) {
  context.x = program;
}

// Start repl
// ---------------------------------------------------------------------------
const r = repl.start({
  prompt: "parse-logs > ",
})
initializeContext(r.context);

r.on('reset', initializeContext);
