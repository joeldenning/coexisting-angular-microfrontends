# light-server

A lightweight cli static http server and it can watch files, execute commands and trigger livereload.

## Why light-server

When I was writing some simple static web apps, it was helpful to have some tools to serve static http, to watch files and run command, and to trigger refresh in browser.

I think the scenario is not too complicated, so I don't want to use heavy tools like grunt or gulp. IMO, npm script with cli tools is already enough.

Here is an [article](http://blog.keithcirkel.co.uk/how-to-use-npm-as-a-build-tool/) about using npm to replace grunt/gulp, I really like it.

There are many existing tools in npm, but I could not find one to do all the things for me. Well, actually browser-sync is one, but it offers too many features I don't need, and its installation time is really, unacceptable.

Not lucky enough :(

Then I wrote light-server, with the following features:

* A simple static http server
* Watch files, support multiple glob expressions
* Trigger custom command if watched files change
* Trigger browser reload if watched files change
* Trigger css reload without refreshing page
* Live reload does not require any setup, and even works on smart phones
* Auto inject client reload javascript in html, no need to manually add
* Live reload websocket server uses the same port as http server
* Proxy to another http server
* Html5 history API mode for SPA

And now my package.json is simpler and cleaner than before :)

## Install

light-server has much smaller footprint, compared to browser-sync, so it is recommended to install in project level, and use it with npm script.

```bash
npm install light-server
```

Of course, you can install it globally, too.

## Usage

```text
Usage: light-server [options]

Options:

  -h, --help                           output usage information
  -V, --version                        output the version number
  -c, --config <configfile>            read options from config file
  -s, --serve <directory>              serve the directory as static http
  --servePrefix <prefix>               virtual path prefix for static directory
  -p, --port <port>                    http server port, default 4000
  -b, --bind <bind>                    bind to a specific host, default 0.0.0.0
  -w, --watchexp <watch expression>    watch expression, repeatable
  -i, --interval <watch inteval>       interval in ms of watching, default 500
  -d, --delay <livereolad delay>       delay in ms before triggering live reload, default 0
  -x, --proxy <upstreamurl>            when file not found, proxy the request to another server
  --proxypath <proxypath>              only send to proxy when path starts with this pattern, default is "/", repeatable
  --no-reload                          disable live-reloading
  -q, --quiet                          quiet mode with minimum log message
  -o, --open                           open browser automatically
  --http2                              enable http2 tls mode
  --historyindex <historyindex>        404 fallback index path, used by SPA development

Examples:

  $ light-server -s . -p 7000
  $ light-server -s dist --http2 -o
  $ light-server -s dist --historyindex '/index.html'
  $ light-server -s . -w "*.js, src/** # npm run build && echo wow!"
  $ light-server -s . -x http://localhost:8000
  $ light-server -s . -x http://localhost:8000 --servePrefix /assets
  $ light-server -s . -b 10.0.0.1
  $ light-server -x http://localhost:9999 --proxypath "/api" -w "public/**"
  $ light-server -s static -w "**/*.css # # reloadcss"
  $ light-server -c .lightserverrc
  & light-server -s . -p 8000 -w "src/**/*.js # npm run js # no-reload"

Watch expression syntax: "files[,files] # [command to run] # [reload action]"
  3 parts delimited by #
  1st part: files to watch, support glob format, delimited by ","
  2nd part: (optional) command to run, before reload
  3rd part: (optional) reload action, default is "reload", also supports "reloadcss" or "no-reload" to run a command without a browser refresh
  Examples:
    "**/*.js, index.html # npm run build # reload"
    "*.css # # reloadcss"
    "** # make"
    "**/*.js # npm run build # no-reload"
```

It is quite simple, specify the folder to serve as static http, specify the files to watch, specify the command to run when watched files change, and light-server will do the job.

**You don't need to add reload script into your html, light-server will inject it automatically.**

You don't need to use all the features, and that's totally ok:

* You can serve http without watching files.
* You can serve http and enable live-reload, without triggering command.
* You can watch files and trigger command, without serving http.

## Manual trigger live-reload

GET or POST `http://localhost:PORT/__lightserver__/trigger`, light-server will send reload event to the browser.

GET or POST `http://localhost:PORT/__lightserver__/triggercss`, light-server will send reloadcss event to the browser.

It means that it's possible to integrate other tools with light-server.

## Proxy

Proxy feature is useful when our project is some backend language(like go, python) + static web page.

For example, a golang web app exposes REST api via <http://host/api/> and server static page from <http://host/>. Then, when we are writing/debugging the static pages, light-server can be helpful. We can firstly launch the whole app and listen at `http://localhost:9000`, then in another terminal window, launch light-server:

```bash
$ cd <your static pages dir>
$ light-server -s . -p 8000 -x http://localhost:9000
```

Now when you access the static pages/js/css, light-server will return it directly. And if you access something like `http://localhost:8000/v1/myapi`, light-server cannot find the resource, and will proxy the request to upstream - `http://localhost:9000/v1/myapi`, which is the golang app.

This is cool because now you can have live-reload, without changing the golang app to add some dirty hacky changes, and you don't need to change the html to inject any extra js just for development. Light-server deals with all the dirty work.

## Example

Let's take a look at a real example. [Riot-Hackernews](https://github.com/txchen/riot-hn) is a static web app powered by riotjs. This is its package.json:

```json
{
  "devDependencies": {
    "browserify": "^8.1.3",
    "light-server": "^1.0.0",
    "minifyify": "^6.2.0",
    "riotify": "^0.0.9"
  },
  "scripts": {
    "build": "npm run build:js && npm run build:css",
    "build:js": "browserify -t [riotify --ext html] -d src/index.js -p [minifyify --compressPath . --map index.js.map --output build/index.js.map] -o build/index.js",
    "build:css": "cp src/main.css build/main.css",
    "dev": "light-server -s . -p 9090 -w \"src/**/*.js, src/**/*.html # npm run build:js\" -w \"src/main.css # npm run build:css # reloadcss\""
  },
  "dependencies": {
    "riot": "^2.0.11"
  }
}
```

The project uses browserify and plugins to bundle the source code into a single bundle.js, it is not using css pre/post processors but for sure it could.

The build process is defined in script `build`, which is quite straightforward.

During development, we can use `npm run dev`, which will use light-server to serve the static content, and watch the changes of any js/html files under `src` directory. When it detects file change, it would trigger build and if build pass, browser will auto reload. And light-server will watch the source css file, when it changes, trigger reloadcss, which is faster than page refresh.

Please notice that windows cannot handle single quotes well, so make sure you are using double quotes when you write complex watch expressions. Or, use the config file described below.

Of course, you can also achieve that by using grunt or gulp, with more dependencies and more LOC.

## Config file

Light-server also supports reading options from a config file. This might be useful if the command line is too long in your package.json.

To use a config file, create a json file and use `-c/--config`. The config template is like this:

```json
{
  "serve": "src",
  "servePrefix": "/assets",
  "port": 8000,
  "bind": "localhost",
  "watchexps": [
    "**.js # npm run build",
    "*.css # # reloadcss"
  ],
  "interval": 500,
  "delay": 0,
  "proxy": "http://localhost:9999",
  "proxypaths": [ "/api" ],
  "noReload": false,
  "quiet": false,
  "open": true,
  "http2": false,
  "historyindex": "/index.html"
}
```

You can use comments in the json, because we love comments in json :) Also all the fields in the json are optional.

[This](./examples/example1/) is an example to show how to use the config file, thanks @Scarysize for making this.

The values in the command line have higher priority than the ones in the config file.

## Changelog

**2019-03-30** `2.6.2`
Bug fix: #46.

**2019-03-15** `2.6.1`
Bug fix: #45.

**2018-10-18** `2.6.0`
Bug fix: #41. Added list dir feature for #42.

**2018-05-10** `2.5.1`
Bug fix: #38.

**2018-03-22** `2.5.0`
Add no-reload option. Thanks @gkalpak for the PR.

**2018-03-21** `2.4.1`
Add serve prefix option. Thanks @AurelienRichez for the PR.

**2018-01-31** `2.4.0`
Use gaze instead of fs.watch, so that we can detect new file added event.

**2018-01-31** `2.3.0`
Support multiple proxypaths in CLI and config. Upgrade deps.

**2018-01-30** `2.2.2`
Add a default extension to static files. Thanks @sidewalksalsa for the PR.

**2017-07-28** `2.2.1`
Open localhost in browser instead of 0.0.0.0, because 0.0.0.0 is not working on win.

**2017-07-26** `2.2.0`
Add --proxypath. Add history fallback mode, for SPA development.

**2017-07-24** `2.1.0`
Add -o/--open option, to open browser automatically.

**2017-04-30** `2.0.2`
Change default bind value to undefined, align with node server.listen.

**2017-01-19** `2.0.0`
Bump version to 2.0.0, since 1.1.8 introduced breaking changes.

**2017-01-19** `1.1.10`
1.1.8 and 1.1.9 introduced breaking change, republish a new 1.1.x to fix.

**2017-01-13** `1.1.9`
Add http2 mode.

**2017-01-13** `1.1.8`
Make the options in configFile, cli and default use consistent names. Thanks @pmast for the initial PR.

**2016-05-30** `1.1.7`
Add no-reload option, thanks @Scarysize for the PR.

**2016-03-10** `1.1.6`
Fix proxyUrl bug, thanks @aemkei for the PR.

**2016-01-25** `1.1.5`
Add config file support.

**2016-01-24** `1.1.4`
Improve css reload, thanks @eliot-akira for the PR.

**2016-01-22** `1.1.3`
Add quiet mode, thanks @eliot-akira for the PR.

**2015-12-01** `1.1.2`
Improve help message.

**2015-12-01** `1.1.1`
Set changeOrigin to true by default when creating proxy. Thanks @joelcollinsdc for reporting this issue.

**2015-10-15** `1.1.0`
Now we can use proxy without static serving. Also improve the html injecting logic

**2015-10-12** `1.0.7`
Upgrade npm dependencies

**2015-07-31** `1.0.6`
Add bind option, by @davidmarkclements

**2015-05-30** `1.0.3`
Fix typo

**2015-04-16** `1.0.1`
Print command execution duration

**2015-04-15** `1.0.0`
New feature: watch and reload css without refreshing page
Breaking change: change CLI interface to support reloadcss

**2015-04-12** `0.1.4`
New feature: proxy

**2015-03-02** `0.1.3`
Add delay option

**2015-02-28** `0.1.1`
First version.
