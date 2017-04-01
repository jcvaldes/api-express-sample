"use strict"
const express = require('express')
const router = express.Router()
const User = require('../lib/model/user')
const jwt = require('jsonwebtoken')
const config = require('../lib/config')
const crypto = require('crypto'),
  algorithm = 'aes-256-ctr',
  password = 'MyHash'

const chai = require('chai')


function encrypt( text ) {
  let cipher = crypto.createCipher(algorithm, password)
  let crypted = cipher.update(text, 'utf8', 'hex')
  crypted += cipher.final('hex')
  return crypted
}

router.post('/', function(req, res, next) {
  console.log("POST", req.body)
  if(!req.body){
    res
      .status(403)
      .json({error: true, message: 'Body empty'})
  }
  let _user = req.body

  User.findOne(
    {username: _user.username}, (err, user) =>{
      if(err){
        res
          .status(403)
          .json({error:true, message:err})
      }
      else if(user) {
        if(user.password ===  encrypt(_user.password)){
          let token = jwt.sign(user, config.secret, {
            expiresIn: '24hr'
          })
          res
            .status(201)
            .json({token: token})
        }else{
          res
            .status(403)
            .json({err: true, message: 'el usuario existe'})
        }
      }
      else {
        if(err){
          res
            .status(403)
            .json({error:true, message: 'No existe el usuario'})
        }
      }
    }
  )
})

module.exports = router
