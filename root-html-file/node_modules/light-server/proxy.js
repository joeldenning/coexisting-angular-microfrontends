'use strict'

var httpProxy = require('http-proxy')
var _this = this

function Proxy (target, paths) {
  if (!(this instanceof Proxy)) return new Proxy(target, paths)
  _this.proxyTarget = target
  _this.proxyPaths = paths
  _this.proxy = httpProxy.createProxyServer({ changeOrigin: true })
}

Proxy.prototype.middleFunc = function (req, res, next) {
  var matchProxy = false
  for (var i = 0, len = _this.proxyPaths.length; i < len; i++) {
    if (req.url.startsWith(_this.proxyPaths[i])) {
      matchProxy = true
      break
    }
  }
  if (!matchProxy) {
    return next()
  }
  _this.proxy.web(req, res, { target: _this.proxyTarget }, function (err, req, res) {
    console.error('failed to connect to proxy: ' + _this.proxyTarget + ' - ' + err.message)
    res.writeHead(500, {
      'Content-Type': 'text/plain'
    })
    res.end(err.stack)
  })
}

module.exports = Proxy
