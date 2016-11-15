'use strict'

// self
const Config = require('./config')
const Composer = require('./index')

Composer((err, server) => {
  if (err) { throw err }

  server.register(['inert', 'hapi-context-app', 'vision', 'hapi-error'].map((dep) => require(dep)), (err) => {
  // server.register(['vision', 'hapi-error'].map((dep) => require(dep)), (err) => {
    if (err) { throw err }

    server.views({
      engines: { html: require('lodash-vision') },
      path: 'templates',
      partialsPath: 'templates/partials',
      // isCached: options.templateCached
      isCached: Config.get('/cache/web')
    })

    server.start((err) => {
      if (err) { throw err }
      console.log('Started the plot device on port ' + server.info.port)
    })
  })
})
