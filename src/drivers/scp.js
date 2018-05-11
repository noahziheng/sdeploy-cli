const shell = require('shelljs')
const BaseDriver = require('./base')

class SCPDriver extends BaseDriver {
  constructor (...args) {
    super(...args)
    this.args = '-rf'
  }

  upload (localpath = '.', remotepath = '') {
    shell.exec(`scp ${this.args} ${localpath} ${this.remote.user}@${this.remote.address}:${this.remote.rootpath}/${remotepath}`)
  }
}

module.exports = SCPDriver
