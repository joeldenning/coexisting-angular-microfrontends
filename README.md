[![Microfrontend Build](https://github.com/romdj/coexisting-angular-microfrontends/actions/workflows/build.yaml/badge.svg)](https://github.com/romdj/coexisting-angular-microfrontends/actions/workflows/build.yaml)

# Coexisting Angular Microfrontends
Demo: http://coexisting-angular-microfrontends.surge.sh

This is a starter-kit / example repository for people who want to have multiple angular microfrontends coexist within a single page. Each
of the angular applications was created and is managed by Angular CLI.

It uses [single-spa](https://single-spa.js.org) to pull this off, which means that you can even add React, Vue, or other frameworks as
additional microfrontends.

For mapping routes to applications it uses [single-spa-layout](https://single-spa.github.io/single-spa.js.org/docs/layout-overview/).

## An important note
This github repository has four projects all in one repo. But when you do this yourself, **you'll want to have one git repo per
angular application**. The root-html-file project should also be in its own repo. This is what lets different teams and developers be in
charge of different microfrontends.

## Local development -- one app at a time
[Tutorial video](https://www.youtube.com/watch?v=vjjcuIxqIzY&list=PLLUD8RtHvsAOhtHnyGx57EYXoaNsxGrTU&index=4)

With single-spa, it is preferred to run `ng serve` in only one single-spa application at a time, while using a deployed
version of the other applications. This makes for an awesome developer experience where you can boot up just one
microfrontend at a time, not even having to clone, npm install, or boot up all of the other ones.

To try this out, clone the repo and run the following commands:
```sh
cd app1
npm i
npm start
```

Now go to http://coexisting-angular-microfrontends.surge.sh in a browser. Click on the yellowish rectangle at the bottom right. Then click on `app1`. Change the module url to http://localhost:4201/main.js. Then apply the override and reload the page. This will have change app1 to load from your localhost instead of from surge.sh. As you modify the code locally, it will
reload the page on coexisting-angular-microfrontends.surge.sh. See https://github.com/joeldenning/import-map-overrides for more info on this.

## Local development -- all at once
It is preferred to only run one app at a time. But if you need to run them all locally, you can do so with the following instructions

```sh
# First terminal tab
cd root-html-file
npm install
npm start
```
```sh
# Second terminal tab
cd app1
npm install
npm start
```

```sh
# Third terminal tab
cd app2
npm install
npm start
```

```sh
# Fourth terminal tab
cd navbar
npm install
npm start
```

Now go to http://localhost:4200 in a browser. Note that you can change any of the ports for the projects by modifying the Import Map inside of
root-html-file/index.html.

If you get serious about deploying your code, you'll want to make it no longer necessary to boot up all of the apps in order to do anything.
When you get to that point, check out [import-map-overrides](https://github.com/joeldenning/import-map-overrides/), which lets you go to
a deployed environment and override the [Import Map](https://github.com/WICG/import-maps) for just one microfrontend at a time. The
import-map-overrides library is already loaded in the index.html of root-html-file, so you can start using it immediately. You can make your
deployed environment overridable, just like you can do overrides on http://coexisting-angular-microfrontends.surge.sh

## More documentation
Go to https://github.com/CanopyTax/single-spa-angular to learn how all of this works.
