import { Component, AfterViewInit } from '@angular/core';

declare var $: any; // for import jquery

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  title = '纬创抽奖后台管理';

  public ngAfterViewInit()
  {
    $('.menu .item').tab();
    this.listEmp();
  }

  listEmp() {
    console.log('### List Emp Info!');
  }

  listPrize() {
    console.log('### List Prize Info!');
  }

  listWinner() {
    console.log('### List Winner Info!');
  }
}
