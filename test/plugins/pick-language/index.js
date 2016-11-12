'use strict'

const Lab = require('lab')
const Code = require('code')
const Config = require('../../../config')
const Hapi = require('hapi')
const Vision = require('vision')
const Inert = require('inert')
const I18N = require('hapi-i18n')
const PickLanguage = require('../../../plugins/pick-language/index')
const ContextApp = require('hapi-context-app')
const HomePlugin = require('../../../server/web/index')

const lab = exports.lab = Lab.script()
let request
let server

lab.beforeEach((done) => {
  const plugins = [ContextApp, Inert, PickLanguage, Vision, HomePlugin]
  server = new Hapi.Server()
  server.connection({ port: Config.get('/port/web') })
  server.settings.app = {
    siteTitle: Config.get('/app/siteTitle'),
    languages: Config.get('/i18n/locales')
  }

  server.register(
    {
      register: I18N,
      options: {
        locales: Config.get('/i18n/locales'),
        directory: 'locales'
      }
    },
    (err) => { if (err) { return done(err) } }
  )

  server.register(plugins, (err) => {
    if (err) { return done(err) }
    server.views({
      engines: { html: require('lodash-vision') },
      path: './server/web'
    })

    done()
  })
})

lab.experiment('Home Page View', () => {
  lab.beforeEach((done) => {
    request = {
      method: 'GET',
      url: '/fr/'
    }

    done()
  })

  lab.test('home page renders properly (fr)', (done) => {
    server.inject(request, (response) => {
      Code.expect(response.result).to.match(/Choisir la langue/i)
      Code.expect(response.result).to.match(/<li class="active">[^]+<a href="\/fr\/">Français<\/a>/i)
      Code.expect(response.result).to.match(/<li>[^]+<a href="\/en\/">English<\/a>/i)
      Code.expect(response.statusCode).to.equal(200)

      done()
    })
  })
})

lab.experiment('Home Page View (en)', () => {
  lab.beforeEach((done) => {
    request = {
      method: 'GET',
      url: '/en/'
    }

    done()
  })

  lab.test('home page renders properly', (done) => {
    server.inject(request, (response) => {
      Code.expect(response.result).to.match(/Pick your language/i)
      Code.expect(response.result).to.match(/<li class="active">[^]+<a href="\/en\/">English<\/a>/i)
      Code.expect(response.result).to.match(/<li>[^]+<a href="\/fr\/">Français<\/a>/i)
      Code.expect(response.statusCode).to.equal(200)

      done()
    })
  })
})
