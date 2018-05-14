class BaseDriver {
  /**
   * Creates an instance of BaseDriver.
   * @param {String} address Remote Server Address(IP/Domain)
   * @param {String} user Remote Username
   * @param {String} rootpath Remote root path
   * @memberof BaseDriver
   */
  constructor (address, user, rootpath) {
    this.remote = {
      address: address,
      user: user,
      rootpath: rootpath
    }
  }

  /**
   * Method for set driver arguments
   *
   * @param {String} args UNIX Command Arguments
   * @memberof BaseDriver
   */
  setArgs (args) {
    this.args = args
  }

  /**
   * Method for upload files(Need driver to implement)
   *
   * @param {string} [localpath='.'] Local Path
   * @param {string} [remotepath=''] Remote Path(absolute root path)
   * @memberof BaseDriver
   */
  upload (localpath = '.', remotepath = '') {}
}

module.exports = BaseDriver
