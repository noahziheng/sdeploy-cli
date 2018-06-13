const shell = require('shelljs')
const BaseDriver = require('./base')
const ArgArr = require('../driver-arg.json')

class RSyncDriver extends BaseDriver {
  constructor (...args) {
    super(...args)
    this.args = ArgArr[0]
  }

  upload (localpath = '.', remotepath = '') {
    return new Promise((resolve, reject) => {
      const command = `rsync ${localpath} ${this.remote.user}@${this.remote.address}:${this.remote.rootpath}/${remotepath} ${this.args}`
      console.log('Running command:', command)
      const result = shell.exec(command)
      return result.code !== 0 ? reject(new Error(result.stderr)) : resolve(result)
    })
  }
}

module.exports = RSyncDriver
