'use strict'

const Wreck = require('wreck')
const Config = require('../../config')

exports.register = (server, options, next) => {
  server.views({
    engines: { html: require('lodash-vision') },
    path: 'templates',
    partialsPath: 'templates/partials',
    isCached: options.templateCached
  })

  const newDoc = function (request, reply) {
    // request.payload._id = request.payload.id
    // delete request.payload.id
    console.log(request.payload)
    reply('yup')
  }

  const mapper = (request, callback) => {
    const it = [Config.get('/db/url'), Config.get('/db/name')]
    it.push(request.params.pathy ? request.params.pathy : '_all_docs')
    callback(null, it.join('/') + '?include_docs=true', { accept: 'application/json' })
  }

  const responder = (err, res, request, reply, settings, ttl) => {
    const go = (err, payload) => {
      if (err) { return reply(err) } // FIXME: how to test?
      let tpl
      let obj
      if (payload._id) {
        tpl = 'doc'
        obj = { doc: payload }
      } else if (payload.rows) {
        tpl = 'docs'
        obj = { docs: payload.rows.map((d) => d.doc) }
      } else {
        return reply.notImplemented('What\'s that?', payload)
      }
      const etag = request.auth.credentials && request.auth.credentials.name
        ? ('"' + res.headers.etag.slice(1, -1) + ':' + request.auth.credentials.name + '"')
        : res.headers.etag
      reply.view(tpl, obj).etag(etag)
    }

    if (err) { return reply(err) } // FIXME: how to test?
    if (res.statusCode >= 400) { return reply(res.statusMessage).code(res.statusCode) }
    Wreck.read(res, { json: true }, go)
  }

  server.route({
    method: 'GET',
    path: '/new',
    config: {
      auth: {
        mode: 'required'
      },
      handler: { view: 'new-doc' }
    }
  })

  server.route({
    method: 'POST',
    path: '/new',
    config: {
      auth: {
        mode: 'required'
      },
      handler: newDoc
    }
  })

  server.route({
    method: 'GET',
    path: '/{pathy*}',
    handler: {
      proxy: {
        passThrough: true,
        mapUri: mapper,
        onResponse: responder
      }
    }
  })

  next()
}

exports.register.attributes = {
  name: 'main',
  dependencies: ['hapi-context-app', 'h2o2', 'vision']
}
