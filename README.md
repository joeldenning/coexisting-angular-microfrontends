# Coexisting Angular Microfrontends
This is a starter-kit / example repository for people who want to have multiple angular microfrontends coexist within a single page. Each
of the angular applications was created and is managed by Angular CLI.

It uses [single-spa](https://single-spa.js.org) to pull this off, which means that you can even add React, Vue, or other frameworks as
additional microfrontends.

## An important note
This github repository has four projects all in one repo. But when you do this yourself, **you'll want to have one git repo per
angular application**. The root-html-file project should also be in its own repo. This is what lets different teams and developers be in
charge of different microfrontends.

## Local development flow
With single-spa, it is preferred to run `ng serve` in only one single-spa application at a time, while using a deployed
version of the other applications. This makes for an awesome developer experience where you can boot up just one
microfrontend at a time, not even having to clone all the microfrontends.

When you clone this repo you will not yet have a deployed environment for your microfrontends. This means that you'll have to boot up
all of the microfrontends in separate terminal tabs to try this out locally.

If you get serious about deploying your code, you'll want to make it no longer necessary to boot up all of the apps in order to do anything.
When you get to that point, check out [import-map-overrides](https://github.com/joeldenning/import-map-overrides/), which lets you go to
a deployed environment and override the [Import Map](https://github.com/WICG/import-maps) for just one microfrontend at a time. The
import-map-overrides library is already loaded in the index.html of root-html-file, so you can start using it immediately.

## Instructions
After cloning the repo, run the following commands from inside of the coexisting-angular-microfrontends directory:

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
ng serve --port 4201 --publicHost http://localhost:4201
```

```sh
# Third terminal tab
cd app2
npm install
ng serve --port 4202 --publicHost http://localhost:4202
```

```sh
# Fourth terminal tab
cd navbar
npm install
ng serve --port 4203 --publicHost http://localhost:4203
```

Now go to http://localhost:4200 in a browser. Note that you can change any of the ports for the projects by modifying the Import Map inside of
root-html-file/index.html.

## More documentation
Go to https://github.com/CanopyTax/single-spa-angular to learn how all of this works.