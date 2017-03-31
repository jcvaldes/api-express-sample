"use strict"
const express = require('express')
const router = express.Router()
const User = require('../lib/model/user')
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

function decrypt( text ) {
  let decipher = crypto.createDecipher(algorithm, password)
  let dec = decipher.update(text, 'hex', 'utf8')
  dec += decipher.final('utf8')
  return dec
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
        if(decrypt(user.password) == _user.password){
          res
            .status(201)
            .json({user: user})
        }else{
          res
            .status(403)
            .json({err: true, message: 'el usuario existe'})
        }
      }
      else {
        new User({
          username: _user.username,
          password: encrypt(_user.password)
        }).save((err, user) => {
          if(err){
            res
              .status(403)
              .json({error:true, message: err})
          }

          res
            .status(201)
            .json({user:user})
        })
      }
    }
  )
})

module.exports = router
