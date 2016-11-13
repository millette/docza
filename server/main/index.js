'use strict'

// self
const Config = require('../../config')

// npm
const Wreck = require('wreck')
const nano = require('cloudant-nano')
const pify = require('pify')
const truncate = require('html-truncate')
const sharp = require('sharp')

// core
const url = require('url')

const reserved = ['new', 'user', 'css', 'js', 'img']

const dbUrl = url.resolve(Config.get('/db/url'), Config.get('/db/name'))

const mapper = (request, callback) => {
  const it = [dbUrl]
  it.push(request.params.pathy ? request.params.pathy : '_all_docs')
  callback(null, it.join('/') + '?include_docs=true', { accept: 'application/json' })
}

const mapperJpeg = (request, callback) => {
  const it = [dbUrl]
  it.push(request.params.pathy)
  it.push('top-image.jpeg')
  callback(null, it.join('/'))
}

const mapperPng = (request, callback) => {
  const it = [dbUrl]
  it.push(request.params.pathy)
  it.push('top-image.png')
  callback(null, it.join('/'))
}

const responder = (err, res, request, reply) => {
  if (err) { return reply(err) } // FIXME: how to test?
  if (res.statusCode >= 400) { return reply(res.statusMessage).code(res.statusCode) }
  if (request.params.action && request.params.action !== 'edit') { return reply.notFound(request.params.action) }

  const go = (err, payload) => {
    if (err) { return reply(err) } // FIXME: how to test?
    let tpl
    let obj
    if (payload._id) {
      if (request.params.action) {
        tpl = 'edit-doc'
      } else {
        tpl = 'doc'
      }
      obj = { doc: payload }
    } else if (payload.rows) {
      tpl = 'docs'
      obj = {
        docs: payload.rows.map((d) => {
          if (d.doc.content) {
            d.doc.content = truncate(d.doc.content, Config.get('/teaser/length'))
          }
          return d.doc
        })
      }
    } else {
      return reply.notImplemented('What\'s that?', payload)
    }
    const etag = request.auth.credentials && request.auth.credentials.name
      ? ('"' + res.headers.etag.slice(1, -1) + ':' + request.auth.credentials.name + '"')
      : res.headers.etag
    reply.view(tpl, obj).etag(etag)
  }

  Wreck.read(res, { json: true }, go)
}

const getDoc = function (request, reply) {
  const db = nano({
    url: dbUrl,
    cookie: request.auth.credentials.cookie
  })

  const get = pify(db.get, { multiArgs: true })
  get(request.params.pathy)
    .then((x) => reply(x[0]))
    .catch(reply)
}

const editDoc = function (request, reply) {
  if (reserved.indexOf(request.payload.id) !== -1) { return reply.forbidden('The provided field "id" is unacceptable.', { reserved: reserved }) }
  request.payload._id = request.payload.id
  delete request.payload.id

  if (request.payload.rev) {
    request.payload._rev = request.payload.rev
    delete request.payload.rev
  }

  if (request.pre && request.pre.m1 && request.pre.m1._attachments) {
    request.payload._attachments = request.pre.m1._attachments
  }

  const db = nano({
    url: dbUrl,
    cookie: request.auth.credentials.cookie
  })

  const insert = pify(
    (request.payload.jpeg && request.payload.jpeg.length)
      ? db.multipart.insert
      : db.insert,
    { multiArgs: true }
  )

  let p
  if (request.payload.jpeg && request.payload.jpeg.length) {
    const imgData = Buffer.from(request.payload.jpeg)
    delete request.payload.jpeg

    p = sharp(imgData).metadata()
      .then((m) => [{
          name: 'top-image.' + m.format,
          data: imgData,
          content_type: 'image/' + m.format
      }])
      .then((atts) => insert(request.payload, atts, request.payload._id))
  } else {
    delete request.payload.jpeg
    p = insert(request.payload)
  }

  p.then((x) => reply.redirect('/' + x[0].id))
    .catch((err) => reply.boom(err.statusCode, err))
}

exports.register = (server, options, next) => {
  server.views({
    engines: { html: require('lodash-vision') },
    path: 'templates',
    partialsPath: 'templates/partials',
    isCached: options.templateCached
  })

  server.route({
    method: 'GET',
    path: '/new',
    config: {
      auth: { mode: 'required' },
      handler: { view: 'new-doc' }
    }
  })

  server.route({
    method: 'POST',
    path: '/new',
    config: {
      auth: { mode: 'required' },
      handler: editDoc
    }
  })

  server.route({
    method: 'GET',
    path: '/',
    handler: {
      proxy: {
        passThrough: true,
        mapUri: mapper,
        onResponse: responder
      }
    }
  })

  server.route({
    method: 'GET',
    path: '/{pathy}',
    handler: {
      proxy: {
        passThrough: true,
        mapUri: mapper,
        onResponse: responder
      }
    }
  })

  server.route({
    method: 'GET',
    path: '/{pathy}/top-image.jpeg',
    config: {
      handler: {
        proxy: {
          passThrough: true,
          mapUri: mapperJpeg
        }
      }
    }
  })

  server.route({
    method: 'GET',
    path: '/{pathy}/top-image.png',
    config: {
      handler: {
        proxy: {
          passThrough: true,
          mapUri: mapperPng
        }
      }
    }
  })

  server.route({
    method: 'GET',
    path: '/{pathy}/{action}',
    config: {
      auth: { mode: 'required' },
      handler: {
        proxy: {
          passThrough: true,
          mapUri: mapper,
          onResponse: responder
        }
      }
    }
  })

  server.route({
    method: 'POST',
    path: '/{pathy}/{action}',
    config: {
      pre: [ { method: getDoc, assign: 'm1' } ],
      auth: { mode: 'required' },
      handler: editDoc
    }
  })

  next()
}

exports.register.attributes = {
  name: 'main',
  dependencies: ['hapi-context-app', 'h2o2', 'vision']
}
