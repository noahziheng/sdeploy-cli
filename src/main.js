const Conf = require('conf')
const inquirer = require('inquirer')
const pathMod = require('path')
const chalk = require('chalk')
const shell = require('shelljs')
const defaultConfig = require('./default.json')
const ArgArr = require('./driver-arg.json')
const DriverArr = require('./drivers')

class NotRealPromiseException extends Error {}

class AppCore {
  /**
   * Creates an instance of AppCore.
   * @param {Boolean} [newF=false] A flag to skip config select,do new action directly.
   * @param {String} [remotepath=null] The remote path need upload which absolute the rootpath in config.
   * @param {String} [postScript=null] The shell command will be execute before upload.
   * @memberof AppCore
   */
  constructor (newF = false, remotepath = '', postScript = null) {
    this.newF = newF
    this.remotepath = remotepath
    this.postScript = postScript
    this.conf = new Conf({
      defaults: defaultConfig
    })
  }

  /**
   * App Main Entry
   *
   * @param {String} configName Config's name
   * @param {String} configPath Config's path
   * @memberof AppCore
   */
  run (localpath, configName = null, configPath = null) {
    this.localpath = localpath
    this.loadConfig(configPath) // Load Configs
    console.log('Current config location:', this.conf.path)
    const c = this.getConfig(configName)
    let p
    if (c) {
      p = this.doUpload(c)
    } else {
      const newF = this.newF
      p = inquirer.prompt([
        {
          type: 'list',
          name: 'config',
          message: 'What\'s config you want to select?',
          choices: session => {
            const arr = [{name: 'Add Config', value: 'add'}]
            const configs = this.conf.get('configs')
            if (configs.length !== 0) {
              arr.unshift(new inquirer.Separator())
              configs.forEach((item, i) => {
                arr.unshift({name: item.name, value: i})
              })
            }
            return arr
          },
          when: !newF
        },
        {
          type: 'list',
          name: 'action',
          message: 'What\'re you want to?',
          choices: [
            {name: 'Start Upload', value: 0},
            {name: 'View Config', value: 1},
            {name: 'Edit Config', value: 2},
            {name: 'Delete Config', value: 3}
          ],
          when: session => session.config !== 'add' && !newF
        }
      ]).then(r => r.config === 'add' || newF ? this.addConfig() : this.doAction(r))
    }
    p.then(r => console.log(`[${this.getColorStatus(r.status)}] ${r.message}`))
      .catch(ex => {
        if (ex instanceof NotRealPromiseException) {
          return true
        }
        console.log('ex: ', ex)
        return false
      })
  }

  /**
   * A Function to get Config by Configname
   *
   * @param {String} name Configname
   * @returns {Object} Config object
   * @memberof AppCore
   */
  getConfig (name) {
    const configArr = this.conf.get('configs')
    let r = -1
    configArr.forEach((item, i) => {
      if (item.name === name) r = i
    })
    return r < 0 ? null : configArr[r]
  }

  /**
   * A Function for get colored status
   *
   * @param {Boolean} status Status bool var
   * @returns {String}
   * @memberof AppCore
   */
  getColorStatus (status) {
    return status ? chalk.green('Success') : chalk.red('Failed')
  }

  /**
   * A Method for load configuations
   *
   * @param {Number} [i=-1] Selected config index
   * @param {String} [path=null] Config file's path
   * @memberof AppCore
   */
  loadConfig (path = null) {
    if (!path) return
    path = pathMod.parse(path)
    this.conf = new Conf({
      defaults: defaultConfig,
      cwd: path.dir,
      configName: path.name
    })
  }

  /**
   * A Method for add new configuation
   *
   * @returns {Promise}
   * @memberof AppCore
   */
  addConfig (i = -1) {
    const configArr = this.conf.get('configs')
    const lastType = i >= 0 ? configArr[i].type : ''
    return inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'What\'s config name?',
        default: i >= 0 ? configArr[i].name : null
      },
      {
        type: 'list',
        name: 'type',
        message: 'What\'s driver you want to select?',
        choices: [
          {name: 'RSyncDriver', value: 0},
          {name: 'SCPDriver', value: 1},
          {name: 'SFTPDriver', value: 2}
        ],
        default: i >= 0 ? configArr[i].type : null
      },
      {
        type: 'input',
        name: 'address',
        message: 'What\'s remote server address?',
        default: i >= 0 ? configArr[i].address : null
      },
      {
        type: 'input',
        name: 'user',
        message: 'What\'s remote server user?',
        default: i >= 0 ? configArr[i].user : 'root'
      },
      {
        type: 'input',
        name: 'rootpath',
        message: 'What\'s remote server rootpath?',
        default: i >= 0 ? configArr[i].rootpath : '~/'
      },
      {
        type: 'input',
        name: 'arg',
        message: 'What\'s upload driver argument?',
        default: session => {
          return i >= 0
            ? (lastType !== session.type ? ArgArr[session.type] : configArr[i].arg)
            : ArgArr[session.type]
        }
      }
    ]).then(r => {
      const arr = this.conf.get('configs', [])
      if (i < 0) arr.push(r)
      else arr.splice(i, 1, r)
      this.conf.set('configs', arr)
      return r
    })
      .then(r => {
        return {
          status: true,
          message: (i < 0 ? 'Added ' : 'Edited ') + r.name
        }
      })
  }

  /**
   * A Method for add new configuation
   *
   * @param {Number} i Selected config index
   * @returns {Promise}
   * @memberof AppCore
   */
  delConfig (i) {
    const configArr = this.conf.get('configs')
    const config = configArr[i]
    configArr.splice(i, 1)
    this.conf.set('configs', configArr)
    return {
      status: true,
      message: 'Deleted ' + config.name
    }
  }

  /**
   * A Method for handle action select
   *
   * @param {Object} r Selected answers hash arr
   * @returns {Promise}
   * @memberof AppCore
   */
  doAction (r) {
    const configArr = this.conf.get('configs')
    if (r.action === 0) return this.doUpload(configArr[r.config])
    else if (r.action === 1) {
      console.log(configArr[r.config])
      return Promise.reject(new NotRealPromiseException('View'))
    } else if (r.action === 2) return this.addConfig(r.config)
    else if (r.action === 3) return this.delConfig(r.config)
    else throw new Error('Error Argument')
  }

  /**
   * A Method for starting upload progress
   *
   * @param {Object} config Config info object
   * @returns {Promise}
   * @memberof AppCore
   */
  doUpload (config) {
    const Driver = DriverArr[config.type]
    if (this.postScript) {
      const r = shell.exec(this.postScript)
      if (r.code !== 0) return Promise.reject(new Error(r.stderr))
    }
    return new Driver(config.address, config.user, config.rootpath, config.arg).upload(this.localpath, this.remotepath)
      .then(r => {
        return {
          status: r.code === 0,
          message: 'Upload finished.'
        }
      })
  }
}

module.exports = AppCore
