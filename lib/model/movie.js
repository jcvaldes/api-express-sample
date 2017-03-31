"use strict"
const mongoose = require('mongoose')

const MovieSchema = new mongoose.Schema({
  title: { type: String, require: true },
  year: { type:String, require:true }
})

module.exports = mongoose.model('Movie', MovieSchema)