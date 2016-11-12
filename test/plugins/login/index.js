'use strict'

const Lab = require('lab')
const Code = require('code')
const Config = require('../../../config')
const Hapi = require('hapi')
const Vision = require('vision')
const Inert = require('inert')
const I18N = require('hapi-i18n')
// const AuthCookie = require('hapi-auth-cookie')
const PickLanguage = require('../../../plugins/pick-language/index')
const ContextApp = require('hapi-context-app')
const HomePlugin = require('../../../server/web/index')
const LoginPlugin = require('../../../plugins/login/index')

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
    (err) => {
//      console.log('REG0:', err)
      if (err) { return done(err) }
    }
    // (err) => { if (err) { return done(err) } }
  )

  server.register(
    {
      register: LoginPlugin,
      options: { cookie: {
        password: Config.get('/cookie/password'),
        secure: Config.get('/cookie/secure')
      } }
    },
    (err) => {
//      console.log('REG1:', err)
      if (err) { return done(err) }
    }
  )

  server.register(plugins, (err) => {
//    console.log('REG2:', err)
    if (err) { return done(err) }
    server.views({
      engines: { html: require('lodash-vision') },
      path: './server/web'
    })

    done()
  })
})

lab.experiment('LOGIN Home Page View', () => {
  lab.beforeEach((done) => {
    request = {
      method: 'GET',
      url: '/fr/'
    }

    done()
  })

  lab.test('LOGIN home page renders properly (fr)', (done) => {
    server.inject(request, (response) => {
      Code.expect(response.result).to.match(/action="\/user\/login"/i)
      Code.expect(response.result).to.match(/action="\/user\/register"/i)
      Code.expect(response.statusCode).to.equal(200)

      done()
    })
  })
})

/*
lab.experiment('LOGIN POST Home Page View', () => {
  lab.beforeEach((done) => {
    request = {
      method: 'POST',
      url: '/login',
      payload: {
        name: 'bob2',
        password: 'bbb'
      }
    }

    done()
  })

  lab.test('LOGIN POST home page renders properly (fr)', (done) => {
    server.inject(request, (response) => {
      console.log('RESP REZ:', response.result)
      // Code.expect(response.result).to.match(/action="\/user\/login"/i)
      // Code.expect(response.result).to.match(/action="\/user\/register"/i)
      Code.expect(response.statusCode).to.equal(200)

      done()
    })
  })
})
*/
