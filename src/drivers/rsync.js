const shell = require('shelljs')
const BaseDriver = require('./base')

class RSyncDriver extends BaseDriver {
  constructor (...args) {
    super(...args)
    this.args = '-r -l --progress --delete --force'
  }

  upload (localpath = '.', remotepath = '') {
    shell.exec(`rsync ${localpath} ${this.remote.user}@${this.remote.address}:${this.remote.rootpath}/${remotepath} ${this.args}`)
  }
}

module.exports = RSyncDriver
