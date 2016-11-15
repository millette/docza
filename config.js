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
  app: { siteTitle: 'Pizzaloca' },
  db: { url: 'http://localhost:5984', name: 'pizzaloca' },
  cookie: {
    password: 'password-should-be-32-characters',
    secure: defFalse
  },
  teaser: { length: 1000 },
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
