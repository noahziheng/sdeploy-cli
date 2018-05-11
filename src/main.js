class AppCore {
  /**
   * Creates an instance of AppCore.
   * @param {Boolean} [newF=false] A flag to skip config select,do new action directly.
   * @param {String} [outputPath=null] Config file output path,skip upload action if not null.
   * @memberof AppCore
   */
  constructor (newF = false, outputPath = null) {
    this.newF = newF
    this.outputPath = outputPath
  }

  /**
   * App Main Entry
   *
   * @param {String} arg Command arg,maybe config's name or path
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
