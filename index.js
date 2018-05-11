#!/usr/bin/env node
const program = require('commander')
const AppCore = require('./src/main')

program
  .version('0.1.0')
  .usage('[config name/path]')
  .option('-n, --new', 'Skip configuation select, do new action directly.')
  .option('-o, --output <path>', 'Output the configuation to file instead of do upload action.')
  .parse(process.argv)

if (program.args.length < 1) {
  // No arg,show the help infomation
  program.outputHelp()
  process.exit()
}

AppCore(program.new, program.output).run(program.args[0]) // Run app
