"use strict"
// agrego it.only para ejecutar 1 solo test
let request = require('supertest-as-promised')
const api = require('../app')
const _ = require('lodash')
const mongoose = require('mongoose')
const config = require('../lib/config')
const host = api

const chai = require('chai')
global.AssertionError = chai.AssertionError
global.expect = chai.expect
request = request(host)
describe('La ruta de usuarios', function () {
  before(() =>{
    mongoose.connect(config.database)
  })
  after((done) =>{
    mongoose.disconnect(done)
    mongoose.models = {}
  })
  describe('una peticion POST', function () {
    it('deberia crear un usuario', function (done) {
      let user = {
        'username': 'jcvaldes',
        'password': 'secret'
      }

      request
        .post('/user')
        .set('Accept', 'application/json')
        .send(user)
        .expect(201)
        .expect('Content-Type', /application\/json/)
        .end((err, res) => {
          let body = res.body
          expect(body).to.have.property('user')
          let user = body.user
          expect(user).to.have.property('_id')
          expect(user).to.have.property('password')
          expect(user).to.have.property('username', 'jcvaldes')
          done(err)
        })
    })
  })
})
