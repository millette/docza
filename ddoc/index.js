'use strict'

// npm
const pify = require('pify')
const push = pify(require('couchdb-push'))

// core
const url = require('url')

module.exports = (Config) => {
  const u = url.parse(Config.get('/db/url'))
  u.auth = Config.get('/db/admin') + ':' + Config.get('/db/password')
  u.pathname = Config.get('/db/name')
  return push(url.format(u), 'ddoc/app', { watch: true })
}
