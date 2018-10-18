import { Component, OnInit } from '@angular/core';

declare var $: any;

@Component({
  selector: 'app-winner',
  templateUrl: './winner.component.html',
  styleUrls: ['./winner.component.css']
})
export class WinnerComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    $("#menu31").popup({
      variation: 'inverted',
      content  : '下载获奖名单',
      target   : $("#menu31")
    });
    $("#menu32").popup({
      variation: 'inverted',
      content  : '重新抽奖',
      target   : $("#menu32")
    });
  }
}
