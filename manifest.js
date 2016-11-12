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
    debug: { log: ['error'], request: ['error'] },
    connections: { routes: { security: true } }
  },
  connections: [{
    port: Config.get('/port/web'),
    labels: ['web']
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
    { plugin: 'hapi-context-app' },
    { plugin: 'hapi-context-credentials' },
    { plugin: 'h2o2' },
    { plugin: 'inert' },
    { plugin: 'vision' },
    { plugin: './server/web/index' },
    {
//      options: { routes: { prefix: '/{languageCode}' } },
      plugin: {
        register: './server/main/index',
        options: { templateCached: Config.get('/cache/web') }
      }
    }
  ]
}

const store = new Confidence.Store(manifest)
exports.get = (key) => store.get(key, criteria)
exports.meta = (key) => store.meta(key, criteria)
