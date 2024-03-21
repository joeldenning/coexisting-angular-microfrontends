// A mini-application
import { Injectable } from '@angular/core';

@Injectable()
export class Logger {
  log(message: string) { console.log(message); }
}

import { Component } from '@angular/core';

@Component({
 selector: 'app-root',
 template: 'Welcome to Angular'
})
export class AppComponent {
  constructor(logger: Logger) {
    logger.log('Let the fun begin!');
  }
}

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
@NgModule({
  imports:      [ BrowserModule ],
  providers:    [ Logger ],
  declarations: [ AppComponent ],
  exports:      [ AppComponent ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

platformBrowserDynamic().bootstrapModule(AppModule);
