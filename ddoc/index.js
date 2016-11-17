'use strict'

// npm
const pify = require('pify')
const push = pify(require('couchdb-push'))
// const push = require('couchdb-push')

// core
const url = require('url')

// FIXME: Not actually watching
module.exports = (Config) => {
// module.exports = (Config, callback) => {
  const u = url.parse(Config.get('/db/url'))
  u.auth = Config.get('/db/admin') + ':' + Config.get('/db/password')
  u.pathname = Config.get('/db/name')
  return push(url.format(u), 'ddoc/app')
  // return push(url.format(u), 'ddoc/app', { watch: true })
  // push(url.format(u), 'ddoc/app', { watch: true }, callback)
}
