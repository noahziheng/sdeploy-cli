#!/usr/bin/env node
const program = require('commander')
const AppCore = require('./src/main')

program
  .version('0.1.0')
  .usage('[config name]')
  .option('-c, --config <path>', 'The config file\'s location, default file is on ~/.config globally.')
  .option('-n, --new', 'Skip configuation select, do new action directly.')
  .option('-o, --output <path>', 'Output the configuation to file instead of do upload action.')
  .parse(process.argv)
console.log(program)

new AppCore(program.new, program.output).run(
  program.args.shift(), // Config Name
  program.config // Config Path
) // Run app
