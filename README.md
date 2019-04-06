# Coexisting Angular Microfrontends
This is a starter-kit / example repository for people who want to have multiple angular microfrontends coexist within a single page. Each
of the angular applications was created and is managed by Angular CLI.

It uses [single-spa](https://single-spa.js.org) to pull this off, which means that you can even add React, Vue, or other frameworks as
additional microfrontends.

## Instructions
Ignore how tedious the developer experience is right now -- it will be fixed with https://github.com/CanopyTax/single-spa-angular/issues/41

After cloning the repo, uun the following commands in a terminal from inside of the cloned project
```sh
cd navbar
npm install
npm run build
cd ../app1
npm install
npm run build
cd ../app2
npm install
npm run build
cd ..
npx serve -s 
```

Now open your browser to the url it says to open (usually http://localhost:5000).