#!/usr/bin/env node
const program = require('commander')
const AppCore = require('./src/main')

program
  .version('0.1.0')
  .usage('[config name]')
  .option('-c, --config <path>', 'The config file\'s location, default file is on ~/.config globally.')
  .option('-n, --new', 'Skip configuation select, do new action directly.')
  .option('-p, --postscript <path>', 'Execute command before upload files.')
  .parse(process.argv)
console.log(program)

new AppCore(program.new, program.postscript).run(
  program.args.shift(), // Config Name
  program.config // Config Path
) // Run app
