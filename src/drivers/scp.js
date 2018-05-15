const shell = require('shelljs')
const BaseDriver = require('./base')
const ArgArr = require('../driver-arg.json')

class SCPDriver extends BaseDriver {
  constructor (...args) {
    super(...args)
    this.args = ArgArr[1]
  }

  upload (localpath = '.', remotepath = '') {
    return new Promise((resolve, reject) => {
      const result = shell.exec(`scp ${this.args} ${localpath} ${this.remote.user}@${this.remote.address}:${this.remote.rootpath}/${remotepath}`)
      return result.code !== 0 ? reject(new Error(result.stderr)) : resolve(result)
    })
  }
}

module.exports = SCPDriver
