const RSyncDriver = require('./rsync')
const SCPDriver = require('./scp')
const SFTPDriver = require('./sftp')

module.exports = [
  RSyncDriver,
  SCPDriver,
  SFTPDriver
]
