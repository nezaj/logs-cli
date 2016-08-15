#! /usr/bin/env babel-node
/**
 * Script for generating raw mantra for visualization
 * TODO: Fix notes parsing, right now picking up weekly review
 */
import fs from 'fs'

import program from 'commander'

import {parseMantra} from '../src/parseMantra'

program
  .description('Output json of mantra data')
  .usage('babel-node scripts/parseMantra.js <logFile> <outPath>')
  .parse(process.argv)

if (program.args.length < 2) {
  console.log('ERROR: Please supply a log file to parse and an output path')
} else {
  const logPath = program.args[0]
  const outPath = program.args[1]
  const data = parseMantra(logPath)
  fs.writeFile(outPath, JSON.stringify(data, null, 4), (err) => {
    if (err) { console.log(err) }
    else { console.log("Mantra saved as json at " + outPath) }
  })
}

