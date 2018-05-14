class AppCore {
  /**
   * Creates an instance of AppCore.
   * @param {Boolean} [newF=false] A flag to skip config select,do new action directly.
   * @param {String} [postScript=null] The shell command will be execute before upload.
   * @memberof AppCore
   */
  constructor (newF = false, postScript = null) {
    this.newF = newF
    this.postScript = postScript
  }

  /**
   * App Main Entry
   *
   * @param {String} configName Config's name
   * @param {String} configPath Config's path
   * @memberof AppCore
   */
  run (configName = null, configPath = null) {
    this.loadConfig(configPath) // Load Configs
  }

  /**
   * A Method for load configuations
   *
   * @param {String} [path=null] Config file's path
   * @memberof AppCore
   */
  loadConfig (path = null) {
    if (!path) {}
  }
}

module.exports = AppCore
