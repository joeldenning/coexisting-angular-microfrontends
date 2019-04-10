import { Component, OnDestroy } from '@angular/core';

@Component({
  selector: 'app2-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy {
  title = 'app2';
  ngOnDestroy() {
    console.log('destroying app2')
  }
}
