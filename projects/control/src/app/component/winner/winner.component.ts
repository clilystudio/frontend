import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { PrizeInfo } from 'projects/common/dto/prizeInfo';
import { SysService } from 'projects/common/service/sys.service';
import { WinnerInfo } from 'projects/common/dto/winnerInfo';
import { Const } from 'projects/common/const';
import { ApiResult } from 'projects/common/dto/api-result';
import * as ons from 'onsenui';

declare var $: any;

@Component({
  selector: 'ons-page[winner]',
  templateUrl: './winner.component.html',
  styleUrls: ['./winner.component.css']
})
export class WinnerComponent implements OnInit, AfterViewInit, OnDestroy {

  // 标题
  title: string;

  // 奖项信息
  prizeInfo: PrizeInfo;

  // 中奖一览
  winnerList: WinnerInfo[];

  // 最大可抽选人数
  maxPerson: number;

  // 确认消息
  confirmMessage: string;

  // 中奖信息
  winner: WinnerInfo;

  constructor(private sysService: SysService) {
    this.title = '中奖结果';
  }

  ngOnInit() {
    this.listWinner();
  }

  ngAfterViewInit() {
    document.addEventListener(Const.RELOAD_WINNER, () => this.listWinner());
  }

  ngOnDestroy() {
    document.removeEventListener(Const.RELOAD_WINNER, () => this.listWinner());
  }

  listWinner() {
    this.sysService.getWinner().subscribe(winnerList => {
      this.winnerList = winnerList;
    }, error => this.showError(error));
  }

  /**
   * 显示调用API错误消息
   * @param error 错误
   */
  private showError(error: any) {
    console.error('异常：' + JSON.stringify(error));
  }

  /**
   * 确认放弃中奖
   * @param prizeId 奖项ID
   * @param empId 员工ID
   */
  doRemove(prizeId: string, empId: string) {
    this.winner = this.winnerList.find(w => w.empId === empId && w.prizeId === prizeId);
    if (this.winner) {
      this.confirmMessage = '确定' + this.winner.empName + '要放弃中奖吗？';
      $('#alert-dialog').show();
    }
  }

  /**
   * 放弃中奖
   */
  removeWinner() {
    $('#alert-dialog').hide();
    this.sysService.removeWinner(this.winner).subscribe(result => {
      this.postFinish(result);
    }, error => this.showError(error));
  }

  /**
   * 隐藏确认框
   */
  hideAlertDialog() {
    $('#alert-dialog').hide();
  }

  /**
   * 显示调用API返回结果
   * @param result 结果
   */
  postFinish(result: ApiResult) {
    if (result && result.code) {
      if (result.code === Const.ResultCode.SUCCESS) {
        this.listWinner();
      } else {
        ons.notification.alert(result.message);
      }
    } else {
      ons.notification.alert('网络异常，请联系管理员');
    }
  }
}
