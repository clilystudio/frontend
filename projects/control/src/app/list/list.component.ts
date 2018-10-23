import { Component, OnInit } from '@angular/core';
import { OnsNavigator } from 'ngx-onsenui/ngx-onsenui';
import { PrizeInfo} from '../service/prizeInfo';
import { LottoService } from '../service/lotto.service';
import { LottoComponent } from '../lotto/lotto.component';

@Component({
  selector: 'ons-page',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  prizeList: PrizeInfo[];
  isRunning: boolean;

  constructor(private navigator: OnsNavigator, private lottoService: LottoService) { 
    this.isRunning = false;
  }

  ngOnInit() {
    const progress = this.lottoService.list();
    progress.subscribe(prizeList => this.listFinish(prizeList));
  }

  listFinish(prizeList: PrizeInfo[]) {    
    let lottoPrize = prizeList.find(e => e.prizeStatus == 0);
    if (lottoPrize == undefined) {
      console.log("没有抽选中的奖项");
      this.isRunning = false;
    } else {
      this.isRunning = true;
    }
    this.prizeList = prizeList;
  }

  gotoPrize(prizeId: string) {
    let lottoPrize = this.prizeList.find(e => e.prizeId == prizeId);
    if (lottoPrize == undefined) {
      console.log("无效奖项ID:" + prizeId);
      return;
    }
    if (lottoPrize.prizeStatus == 0) {
      // 抽选中奖项，进入停止界面
      this.navigator.element.pushPage(LottoComponent, {data: lottoPrize});
    } else if (lottoPrize.prizeStatus == 1) { 
      // 待抽选奖项，进入开始界面
    } else {
      // 已抽选奖项，进入获奖名单界面
    }
  }
}
