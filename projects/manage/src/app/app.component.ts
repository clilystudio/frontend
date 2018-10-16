import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { EmpComponent } from './emp/emp.component';

declare var $: any; // for import jquery

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  title = '纬创抽奖后台管理';
  @ViewChild(EmpComponent) empTab;

  public ngAfterViewInit()
  {
    $('.menu .item').tab();
    this.switchtoEmp();
  }

  switchtoEmp() {
    this.empTab.listEmp();
  }

  listPrize() {
    console.log('### List Prize Info!');
  }

  listWinner() {
    console.log('### List Winner Info!');
  }
}
