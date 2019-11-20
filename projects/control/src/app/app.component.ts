import { Component } from '@angular/core';
import { LottoComponent } from './component/lotto/lotto.component';
import { WinnerComponent } from './component/winner/winner.component';

/**
 * 抽奖控制
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  tabLotto = LottoComponent;

  tabWinner = WinnerComponent;
}
