# Coexisting Angular Microfrontends
This is a starter-kit / example repository for people who want to have multiple angular microfrontends coexist within a single page. Each
of the angular applications was created and is managed by Angular CLI.

It uses [single-spa](https://single-spa.js.org) to pull this off, which means that you can even add React, Vue, or other frameworks as
additional microfrontends.

## Instructions
Note that the developer experience for this project will improve via with https://github.com/CanopyTax/single-spa-angular/issues/41

After cloning the repo, run the following commands in a terminal from inside of the cloned project
```sh
cd navbar
npm install
ng build

cd ../app1
npm install
ng build

cd ../app2
npm install
ng build

cd ..
npx serve -s 
```

Now open your browser to the url it says to open (usually http://localhost:5000).

If you want set up a watcher so that you don't have to wait for an entire rebuild everytime you make a code change, run `ng build --watch`
in whichever application(s) that you are working on.

## More documentation
Go to https://github.com/CanopyTax/single-spa-angular to learn how all of this works.