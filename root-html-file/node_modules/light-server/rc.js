'use strict'

var fs = require('fs')
var stripJsonComments = require('strip-json-comments')

function rc (file) {
  var rcContent = fs.readFileSync(file, 'utf-8')
  return JSON.parse(stripJsonComments(rcContent))
}

module.exports = rc
