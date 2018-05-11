const shell = require('shelljs')
const BaseDriver = require('./base')

class SFTPDriver extends BaseDriver {
  constructor (...args) {
    super(...args)
    this.args = '-rf'
  }

  upload (localpath = '.', remotepath = '') {
    shell.echo('SFTP Driver is designing...')
  }
}

module.exports = SFTPDriver
