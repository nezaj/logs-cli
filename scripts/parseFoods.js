#! /usr/bin/env babel-node
/**
 * Script for generating weekly summary of foods eaten
 */
import program from 'commander'

import {parseFoods} from '../src/parseFoods'

program
  .description('Output table of foods from fitness logs')
  .usage('babel-node scripts/parseFoods.js <logFile> [options]')
  .option('-l, --last <date>', 'last date')
  .option('-d, --days <int>', '# of days to look back, defaults to 6', 6)
  .parse(process.argv)

if (program.args.length < 1) {
  console.log('ERROR: Please supply a log file to parse')
} else {
  const logPath = program.args[0]

  let endDate = program.last && new Date(program.last) || new Date();
  let startDate = new Date()
  startDate.setDate(endDate.getDate() - program.days)
  endDate.setHours(0, 0, 0, 0)
  startDate.setHours(0, 0, 0, 0)

  console.log(parseFoods(logPath, startDate, endDate))
}
