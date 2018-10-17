import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { EmpComponent } from './emp/emp.component';
import { PrizeComponent } from './prize/prize.component';

declare var $: any; // for import jquery

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  title = '纬创抽奖后台管理';
  @ViewChild(EmpComponent) empTab;
  @ViewChild(PrizeComponent) prizeTab;

  public ngAfterViewInit()
  {
    $('.menu .item').tab();
    this.switchtoEmp();
  }

  switchtoEmp() {
    this.empTab.listEmp();
  }

  listPrize() {
    this.prizeTab.listPrize();
  }

  listWinner() {
    console.log('### List Winner Info!');
  }
}
