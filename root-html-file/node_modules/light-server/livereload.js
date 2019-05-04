'use strict'

var parseUrl = require('parseurl')
var WS = require('ws').Server
var EventEmitter = require('events').EventEmitter
var prefix = '/__lightserver__'
var clientJsPath = prefix + '/reload-client.js'
var triggerPath = prefix + '/trigger'
var triggerCSSPath = prefix + '/triggercss'

var clientJsContent = [
  'var ws',
  'function socket() {',
  '  ws = new WebSocket("%WS_PROTOCOL%://" + window.location.host)',
  '  ws.onmessage = function (e) {',
  '    var data = JSON.parse(e.data)',
  '    if (data.r) {',
  '      location.reload()',
  '    }',
  '    if (data.rcss) {',
  '      refreshCSS()',
  '    }',
  '  }',
  '}',
  'function refreshCSS() {',
  '  console.log("reload css at:" + new Date())',
  '  var sheets = document.getElementsByTagName("link");',
  '  for (var i = 0; i < sheets.length; i++) {',
  '    var elem = sheets[i];',
  '    var rel = elem.rel;',
  '    if (elem.href && elem.href.substring(0, 5) !== "data:" && (typeof rel != "string" || rel.length == 0 || rel.toLowerCase() == "stylesheet")) {',
  '      var url = elem.href.replace(/(&|\\?)_cacheOverride=\\d+/, "");',
  '      elem.href = url + (url.indexOf("?") >= 0 ? "&" : "?") + "_cacheOverride=" + (new Date().valueOf());',
  '    }',
  '  }',
  '}',
  'socket()',
  'setInterval(function () {',
  '  if (ws) {',
  '    if (ws.readyState !== 1) {',
  '      socket()',
  '    }',
  '  } else {',
  '    socket()',
  '  }',
  '}, 3000)'
].join('\n')

var emitter = new EventEmitter()
var wss
var wsArray = []

function Livereload (options) {
  if (!(this instanceof Livereload)) return new Livereload(options)
  this.options = options
  clientJsContent = clientJsContent.replace('%WS_PROTOCOL%', this.options.http2 ? 'wss' : 'ws')
}

Livereload.prototype.writeLog = function (logLine) {
  !this.options.quiet && console.log(logLine)
}

Livereload.prototype.middleFunc = function livereload (req, res, next) {
  var pathname = parseUrl(req).pathname
  if (req.method === 'GET' && pathname === '/favicon.ico') {
    res.writeHead(204)
    res.end('favicon not found')
    return
  }

  if (pathname.indexOf(prefix) === -1) {
    next()
    return
  }

  if (req.method === 'GET' && pathname === clientJsPath) {
    res.writeHead(200)
    res.end(clientJsContent)
    return
  }

  if (pathname === triggerPath) {
    res.writeHead(200)
    res.end('ok')
    emitter.emit('reload')
    return
  }

  if (pathname === triggerCSSPath) {
    res.writeHead(200)
    res.end('ok')
    emitter.emit('reloadcss')
  }

  next()
}

Livereload.prototype.startWS = function (server) {
  var _this = this
  wss = new WS({ server: server })

  wss.on('connection', function (ws) {
    wsArray.push(ws)
    ws.on('close', function () {
      var index = wsArray.indexOf(ws)
      if (index > -1) {
        wsArray.splice(index, 1)
      }
    })
  })

  emitter.on('reload', function () {
    _this.writeLog('## send reload event via websocket to browser')
    wsArray.forEach(function (w) {
      w.send(JSON.stringify({ r: Date.now().toString() }), function (e) {
        if (e) { console.log('websocket send error: ' + e) }
      })
    })
  })

  emitter.on('reloadcss', function () {
    _this.writeLog('## send reloadcss event via websocket to browser')
    wsArray.forEach(function (w) {
      w.send(JSON.stringify({ rcss: Date.now().toString() }), function (e) {
        if (e) { console.log('websocket send error: ' + e) }
      })
    })
  })
}

Livereload.prototype.triggerReload = function (delay) {
  if (delay) {
    this.writeLog('delay reload for ' + delay + ' ms')
  }

  setTimeout(function () {
    emitter.emit('reload')
  }, delay)
}

Livereload.prototype.triggerCSSReload = function (delay) {
  if (delay) {
    this.writeLog('delay reloadcss for ' + delay + ' ms')
  }

  setTimeout(function () {
    emitter.emit('reloadcss')
  }, delay)
}

Livereload.prototype.trigger = function (action, delay) {
  if (action === 'reloadcss') {
    this.triggerCSSReload(delay)
  } else if (action === 'reload') {
    this.triggerReload(delay)
  }
}

module.exports = Livereload
