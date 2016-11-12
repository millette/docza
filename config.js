'use strict'

const Confidence = require('confidence')
const criteria = { env: process.env.NODE_ENV }

const defFalse = {
  $filter: 'env',
  prod: true,
  $default: false
}

const config = {
  $meta: 'This file configures GlassJaw.',
  projectName: 'docza',
  app: { siteTitle: 'GlassJaw' },
  db: { url: 'http://localhost:5991', name: 'ya' },
  cookie: {
    password: 'password-should-be-32-characters',
    secure: defFalse
  },
  cache: { web: defFalse },
  port: {
    web: {
      $filter: 'env',
      test: 9090,
      $default: 8099
    }
  }
}

const store = new Confidence.Store(config)
exports.get = (key) => store.get(key, criteria)
exports.meta = (key) => store.meta(key, criteria)
