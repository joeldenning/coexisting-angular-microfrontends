import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { assetUrl } from 'src/single-spa/asset-url';

@Component({
  selector: 'app1-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private http: HttpClient) {}
  title = 'app1';
  yoshiUrl = assetUrl("yoshi.png");
  dogUrls = [];
  fetchDog() {
    console.log('fetching dog')
    this.http.get<any>(`https://dog.ceo/api/breeds/image/random`).subscribe(response => {
      console.log(response)
      this.dogUrls.push(response.message)
    })
  }
}
