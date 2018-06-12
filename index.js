'use strict'

var UrlCached = require('./dist/UrlCached').default

module.exports = module.exports.default = function (options) {
  return new UrlCached(options)
}
