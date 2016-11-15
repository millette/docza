'use strict'

const Confidence = require('confidence')
const Config = require('./config')
const criteria = { env: process.env.NODE_ENV }

const manifest = {
  $meta: 'This file defines GlassJaw.',
  server: {
    app: {
      siteTitle: Config.get('/app/siteTitle')
    },
    cache: 'catbox-redis',
    debug: { log: ['error'] },
    connections: { routes: { security: true } }
  },
  connections: [{
    labels: ['web'],
    port: Config.get('/port/web')
  }],
  registrations: [
    {
      plugin: {
        options: {
          cookie: {
            password: Config.get('/cookie/password'),
            secure: Config.get('/cookie/secure')
          }
        },
        register: './plugins/login/index'
      },
      options: { routes: { prefix: '/user' } }
    },
    {
      plugin: {
        register: 'hapi-favicon',
        options: { path: 'assets/img/favicon.ico' }
      }
    },
    { plugin: 'hapi-context-credentials' },
    { plugin: 'h2o2' },
    { plugin: 'inert' },
    { plugin: 'vision' },
    { plugin: './server/web/index' },
    { plugin: './server/main/index' }
  ]
}

const store = new Confidence.Store(manifest)
exports.get = (key) => store.get(key, criteria)
exports.meta = (key) => store.meta(key, criteria)
