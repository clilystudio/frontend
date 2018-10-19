import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ons-page[start]',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.css']
})
export class StartComponent implements OnInit {

  lottoInfo = {
    person: 2,
    max: 20,
    prizeName: '三等奖'
  }

  constructor() { }

  ngOnInit() {
  }
}
