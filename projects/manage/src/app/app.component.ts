import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { EmpComponent } from './component/emp/emp.component';
import { PrizeComponent } from './component/prize/prize.component';
import { WinnerComponent } from './component/winner/winner.component';

declare var $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {

  // 员工信息组件
  @ViewChild(EmpComponent) empTab: EmpComponent;

  // 奖项信息组件
  @ViewChild(PrizeComponent) prizeTab: PrizeComponent;

  // 中奖信息组件
  @ViewChild(WinnerComponent) winnerTab: WinnerComponent;

  public ngAfterViewInit() {
    $('.menu .item').tab();
    this.gotoEmp();
  }

  gotoEmp() {
    this.empTab.listEmp();
  }

  gotoPrize() {
    this.prizeTab.listPrize();
  }

  gotoWinner() {
    this.winnerTab.listWinner();
  }
}
