import { Component, OnInit } from '@angular/core';

import { PrizeInfo} from '../service/prizeInfo';
import { LottoService } from '../service/lotto.service';

@Component({
  selector: 'ons-page[start]',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.css']
})
export class StartComponent implements OnInit {

  prizeList: PrizeInfo[];

  lottoPrize: PrizeInfo;

  lottoStatus: number;

  lottoInfo = {
    person: 2,
    max: 20,
    prizeName: '三等奖'
  }

  constructor(private lottoService: LottoService) { }

  ngOnInit() {
    const progress = this.lottoService.list();
    progress.subscribe(prizeList => this.listFinish(prizeList));
  }

  listFinish(prizeList: PrizeInfo[]) {    
    this.prizeList = prizeList;
    this.lottoPrize = this.prizeList.find(e => e.prizeStatus == 1);
    if (this.lottoPrize == undefined) {
      console.log("没有抽选中奖项");
      this.lottoStatus = 0;
    } else {
      this.lottoStatus = 1;
    }
  }

  startLotto() {
    console.log("###start");
  }

  stopLotto() {
    console.log("###stop");
  }
}
