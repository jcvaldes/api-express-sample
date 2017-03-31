var express = require('express')
var router = express.Router()
const chai = require('chai')
const _ = require('lodash')

global.expect = chai.expect
var Movie = {}
/* GET users listing. */

router.post('/', function(req, res, next) {
  console.log("POST", req.body)
  if(!req.body){
    res
      .status(403)
      .json({error: true, message: 'Body empty'})
  }

  let _movie = req.body
  _movie._id = Date.now()
  Movie[_movie._id] = _movie

  res
    .status(201)
    .json({movie: Movie[_movie._id]})
})
.get('/', function (req, res, next) {
  console.log("GET: ", req.body)
  res
    .status(200)
    .json({movies: _.values(Movie)})

})

.get('/:id', function (req, res, next) {
  console.log("GET:id ", req.params.id)
  if(!req.params.id){
    res
      .status(403)
      .json({error:true, message: 'params empty'})
  }

  let movie = Movie[req.params.id]
  res
    .status(200)
    .json({movie: movie})

})

.put('/:id', function (req, res, next) {
  console.log("PUT:id ", req.params.id)
  if(!req.params.id && !req.body){
    res
      .status(403)
      .json({error:true, message: 'params empty'})
  }

  let newMovie = req.body
  newMovie._id = parseInt(req.params.id, 10)

  Movie[req.params.id] = newMovie
  newMovie = Movie[req.params.id]

  res
    .status(200)
    .json({movie: newMovie})

})

.delete('/:id', function (req, res, next) {
  console.log("DELETE:id ", req.params.id)
  if(!req.params.id){
    res
      .status(403)
      .json({error:true, message: 'params empty'})
  }

  delete Movie[req.params.id]


  res
    .status(400)
    .json({})

})
module.exports = router
