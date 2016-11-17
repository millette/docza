'use strict'

// self
const Manifest = require('./manifest')

// npm
const Glue = require('glue')

const composeOptions = { relativeTo: __dirname }

module.exports = Glue.compose.bind(Glue, Manifest.get('/'), composeOptions)
