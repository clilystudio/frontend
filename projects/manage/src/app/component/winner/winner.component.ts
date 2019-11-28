import { Component, OnInit } from '@angular/core';
import { Const } from '../../../../../common/const';
import { SysService } from 'projects/common/service/sys.service';
import { WinnerInfo } from 'projects/common/dto/winnerInfo';
import { ApiResult } from 'projects/common/dto/api-result';

declare var $: any;

/**
 * 中奖名单管理组件
 */
@Component({
  selector: 'app-winner',
  templateUrl: './winner.component.html',
  styleUrls: ['./winner.component.css']
})
export class WinnerComponent implements OnInit {

  // 系统常量
  C = Const;

  // 对话框标题
  dialogTitle: string;

  // 对话框消息
  dialogMessage: string;

  // 对话框消息
  confireMessage: string;

  // 遮罩
  dimmer: any;

  // 对话框
  dialog: any;

  // 对话框
  confirmDialog: any;

  // 中奖一览
  winnerList: WinnerInfo[];

  // 编辑标识
  confirmFlag = Const.ConfirmFlag.NONE;

  // 中奖者信息
  winner: WinnerInfo;

  constructor(private sysService: SysService) {
    this.winnerList = [];
  }

  ngOnInit() {
    $('#menu31').popup({
      variation: 'inverted',
      content: '前台刷新',
      target: $('#menu31')
    });
    $('#menu32').popup({
      variation: 'inverted',
      content: '重置中奖',
      target: $('#menu32')
    });
    this.dimmer = $('#dimmerWinner');
    this.dialog = $('#dialogWinner');
    this.confirmDialog = $('#dialogConfirm');
    this.dialogMessage = '网络异常，请联系管理员';
  }

  public listWinner() {
    this.sysService.getWinner().subscribe(winnerList => {
      this.winnerList = winnerList;
    }, error => this.showError(error));
  }

  /**
   * 重置中奖确认
   */
  doReset() {
    this.confirmFlag = Const.ConfirmFlag.RESET;
    this.confireMessage = '确定要重置中奖吗？';
    this.confirmDialog.modal('show');
  }

  /**
   * 重置中奖
   */
  resetWinner() {
    this.dimmer.dimmer('show');
    this.sysService.reset().subscribe(result => {
      this.postFinish(result);
    }, error => this.showError(error));
  }

  /**
   * 放弃中奖确认
   */
  doRemove(prizeId: string, empId: string) {
    const winner = this.winnerList.find(e => (e.prizeId === prizeId && e.empId === empId));
    if (winner) {
      this.confirmFlag = Const.ConfirmFlag.REMOVE;
      this.winner = winner;
      this.confireMessage = '确定' + winner.empName + '要放弃中奖吗？';
      this.confirmDialog.modal('show');
    }
  }

  /**
   * 放弃中奖
   */
  removeWinner() {
    this.dimmer.dimmer('show');
    this.sysService.removeWinner(this.winner).subscribe(result => {
      this.postFinish(result);
    }, error => this.showError(error));
  }

  /**
   * 通知前台刷新
   */
  doRefresh() {
    this.confirmFlag = Const.ConfirmFlag.REFRESH;
    this.confireMessage = '确定要刷新前台吗？';
    this.confirmDialog.modal('show');
  }

  /**
   * 刷新前台
   */
  refreshFront() {
    this.dimmer.dimmer('show');
    this.sysService.refresh().subscribe(result => {
      this.postFinish(result);
    }, error => this.showError(error));
  }

  /**
   * 确认操作
   */
  confirm() {
    if (this.confirmFlag === Const.ConfirmFlag.RESET) {
      this.resetWinner();
    } else if (this.confirmFlag === Const.ConfirmFlag.REMOVE) {
      this.removeWinner();
    } else if (this.confirmFlag === Const.ConfirmFlag.REFRESH) {
      this.refreshFront();
    }
    this.confirmFlag = Const.ConfirmFlag.NONE;
  }

  /**
   * 显示调用API返回结果
   * @param result 结果
   */
  postFinish(result: ApiResult) {
    this.dimmer.dimmer('hide');
    if (result && result.code) {
      if (result.code === Const.ResultCode.SUCCESS) {
        this.listWinner();
      } else {
        this.dialogTitle = '提示';
        this.dialogMessage = result.message;
        this.dialog.modal('show');
      }
    } else {
      this.dialogTitle = '提示';
      this.dialogMessage = '网络异常，请联系管理员';
      this.dialog.modal('show');
    }
  }

  /**
   * 显示调用API错误消息
   * @param error 错误
   */
  private showError(error: any) {
    this.dimmer.dimmer('hide');
    console.error('异常：' + JSON.stringify(error));
  }
}
