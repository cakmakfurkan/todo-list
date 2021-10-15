import { Component } from '@angular/core';
import {Location} from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
    constructor(location: Location) {
    if(location.isCurrentPathEqualTo('/'))
      location.go('/todo');
    if(!this.checkCookies() && location.isCurrentPathEqualTo('/todo'))
      location.go('/login');
  }

  private checkCookies(): boolean {
    const ca: Array<string> = decodeURIComponent(document.cookie).split(';');
    const tokenNames: Array<string> = ca.map((token) => token.split('=')[0]);
    if(tokenNames.includes('token'))
      return true;
    else
      return false;
  }
}
