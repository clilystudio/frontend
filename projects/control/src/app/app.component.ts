import { Component } from '@angular/core';
import { StartComponent } from './start/start.component';
import { WinnerComponent } from './winner/winner.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'control';
  start = StartComponent;
  winner = WinnerComponent;
}
