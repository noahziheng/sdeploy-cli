#!/usr/bin/env node
const program = require('commander')
const AppCore = require('./src/main')
const pkg = require('./package.json')

program
  .version('v' + pkg.version)
  .usage('localpath')
  .usage('[config name]')
  .option('-c, --config <path>', 'The config file\'s location, default file is on ~/.config globally.')
  .option('-n, --new', 'Skip configuation select, do new action directly.')
  .option('-p, --postscript <command>', 'Execute command before upload files.')
  .option('-r, --remote-path <path>', 'The remote path need upload which absolute the rootpath in config.')
  .parse(process.argv)

if (program.args.length < 1) {
  console.error('No local path input')
  process.exit()
}

new AppCore(program.new, program['remote-path'], program.postscript).run(
  program.args.shift(), // Local Path
  program.args.shift(), // Config Name
  program.config // Config Path
) // Run app
