var _ = require('lodash')
var path = require('path')
var minimist = require('minimist')
var version = require('./package.json').version
var EventEmitter = require('events')

module.exports = function (cb) {
  var exxon = { version }
  var args = minimist(process.argv.slice(3))
  var conf = {}
  var config = {}
  var overrides = {}

  // 1. load conf overrides file if present
  if(!_.isUndefined(args.conf)){
    try {
      overrides = require(path.resolve(process.cwd(), args.conf))
    } catch (err) {
      console.error(err + ', failed to load conf overrides file!')
    }
  }

  // 2. load conf.js if present
  try {
    conf = require('./conf')
  } catch (err) {
    console.error(err + ', falling back to conf-sample')
  }

  // 3. Load conf-sample.js and merge
  var defaults = require('./conf-sample')
  _.defaultsDeep(config, overrides, conf, defaults)
  exxon.conf = config

  var eventBus = new EventEmitter()
  exxon.conf.eventBus = eventBus

  var authStr = '', authMechanism, connectionString

  if(exxon.conf.mongo.username){
    authStr = encodeURIComponent(exxon.conf.mongo.username)

    if(exxon.conf.mongo.password) authStr += ':' + encodeURIComponent(exxon.conf.mongo.password)

    authStr += '@'

    // authMechanism could be a conf.js parameter to support more mongodb authentication methods
    authMechanism = 'DEFAULT'
  }

  if (exxon.conf.mongo.connectionString) {
    connectionString = exxon.conf.mongo.connectionString
  } else {
    connectionString = 'mongodb://' + authStr + exxon.conf.mongo.host + ':' + exxon.conf.mongo.port + '/' + exxon.conf.mongo.db + '?' +
      (exxon.conf.mongo.replicaSet ? '&replicaSet=' + exxon.conf.mongo.replicaSet : '' ) +
      (authMechanism ? '&authMechanism=' + authMechanism : '' )
  }

  require('mongodb').MongoClient.connect(connectionString, function (err, client) {
    if (err) {
      console.error('WARNING: MongoDB Connection Error: ', err)
      console.error('WARNING: without MongoDB some features (such as backfilling/simulation) may be disabled.')
      console.error('Attempted authentication string: ' + connectionString)
      cb(null, exxon)
      return
    }
    var db = client.db(exxon.conf.mongo.db)
    _.set(exxon, 'conf.db.mongo', db)
    cb(null, exxon)
  })
}
