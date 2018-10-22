import { Component, OnInit } from '@angular/core';
import { PrizeInfo} from '../service/prizeInfo';
import { LottoService } from '../service/lotto.service';

@Component({
  selector: 'ons-page',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  prizeList: PrizeInfo[];
  lottoPrize: PrizeInfo;
  lottoStatus: number;
  isRunning: boolean;

  constructor(private lottoService: LottoService) { 
    this.isRunning = false;
  }

  ngOnInit() {
    this.lottoStatus = 1;
    const progress = this.lottoService.list();
    progress.subscribe(prizeList => this.listFinish(prizeList));
  }

  listFinish(prizeList: PrizeInfo[]) {    
    this.lottoPrize = prizeList.find(e => e.prizeStatus == 0);
    if (this.lottoPrize == undefined) {
      console.log("没有抽选中的奖项");
      this.isRunning = false;
      // this.lottoStatus = 1;
    } else {
      this.isRunning = true;
      // this.lottoStatus = 0;
    }
    this.prizeList = prizeList;
    console.log('###:' + this.isRunning);
  }
}
