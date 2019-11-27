import { Component, OnInit } from '@angular/core';
import { PrizeService } from '../../../../../common/service/prize.service';
import { Const } from '../../../../../common/const';
import { PrizeInfo } from '../../../../../common/dto/prizeInfo';
import { ApiResult } from '../../../../../common/dto/api-result';
import { PrizeGroup } from 'projects/common/dto/prizeGroup';

declare var $: any;

/**
 * 奖项管理组件
 */
@Component({
  selector: 'app-prize',
  templateUrl: './prize.component.html',
  styleUrls: ['./prize.component.css']
})
export class PrizeComponent implements OnInit {

  // 系统常量
  C = Const;

  // 对话框标题
  dialogTitle: string;

  // 对话框消息
  dialogMessage: string;

  // 遮罩
  dimmer: any;

  // 对话框
  dialog: any;

  // 编辑标识
  editFlag: number;

  // 奖项一览列表
  prizeList: PrizeInfo[];

  // 编辑中的奖项信息
  prizeInfo: PrizeInfo;

  constructor(private prizeService: PrizeService) {
    this.prizeInfo = new PrizeInfo();
  }

  ngOnInit() {
    $('#menu21').popup({
      variation: 'inverted',
      content: '添加奖项',
      target: $('#menu21')
    });
    $('#menu22').popup({
      variation: 'inverted',
      content: '删除奖项',
      target: $('#menu22')
    });
    $('#menu23').popup({
      variation: 'inverted',
      content: '批量导入',
      target: $('#menu23')
    });
    $('#menu24').popup({
      variation: 'inverted',
      content: '优先抽取',
      target: $('#menu24')
    });
    $('#menu25').popup({
      variation: 'inverted',
      content: '稍后抽取',
      target: $('#menu25')
    });
    this.dimmer = $('#dimmerPrize');
    this.dialog = $('#dialogPrize');
  }

  /**
   * 批量上传奖项数据
   * @param event 文件上传组件事件
   */
  uploadPrize(event: any) {
    this.dimmer.dimmer({ closable: false }).dimmer('show');
    const file = event.target.files[0];
    this.dialogTitle = '批量导入';
    this.prizeService.upload(file).subscribe(result => this.postFinish(result), error => this.showError(error));
  }

  /**
   * 显示调用API错误消息
   * @param error 错误
   */
  private showError(error: any) {
    this.dimmer.dimmer('hide');
    this.dialogMessage = '异常：' + JSON.stringify(error);
    this.dialog.modal('show');
  }

  /**
   * 显示调用API返回结果
   * @param result 结果
   */
  private postFinish(result: ApiResult) {
    this.dimmer.dimmer('hide');
    if (result.code === Const.ResultCode.SUCCESS) {
      this.listPrize();
    } else {
      this.dialogMessage = result.message;
      this.dialog.modal('show');
    }
  }

  /**
   * 显示奖项一览
   */
  public listPrize() {
    this.prizeService.list().subscribe(prizeList => {
      this.dimmer.dimmer('hide');
      this.prizeList = prizeList;
    }, error => this.showError(error));
  }

  /**
   * 删除奖项
   */
  removePrize() {
    const delPrizes = this.prizeList.filter(e => e.selected);
    if (delPrizes.length === 0) {
      this.dialogTitle = '提示';
      this.dialogMessage = '请选择要删除的奖项';
      this.dialog.modal('show');
      return;
    }
    if (delPrizes.filter(e => e.prizeWinner > 0).length > 0) {
      this.dialogTitle = '提示';
      this.dialogMessage = '已抽奖的的奖项不能删除，请重新选择';
      this.dialog.modal('show');
      return;
    }
    const delPrizeIds = delPrizes.map(e => e.prizeId);
    this.dialogTitle = '删除奖项';
    this.prizeService.delete(delPrizeIds).subscribe(result => this.postFinish(result), error => this.showError(error));
  }

  /**
   * 添加奖项
   */
  newPrize() {
    this.editFlag = Const.EditFlag.ADD;
    this.prizeInfo = new PrizeInfo();
    this.setCheckBox();
    $('#editPrizeWin').modal('show');
  }

  /**
   * 编辑奖项
   */
  editPrize(prizeId: string) {
    this.editFlag = Const.EditFlag.EDIT;
    this.prizeInfo = this.prizeList.find(e => e.prizeId === prizeId);
    if (this.prizeInfo.prizeWinner > 0) {
      this.dialogTitle = '提示';
      this.dialogMessage = '已抽奖的的奖项不能编辑';
      this.dialog.modal('show');
      return;
    }
    this.getPrizeGroup();
    this.setCheckBox();
    $('#editPrizeWin').modal('show');
  }

  /**
   * 取得奖项分组信息
   */
  private getPrizeGroup(): void {
    this.prizeInfo.prizeGroups = [];
    const groups = this.prizeInfo.groupLimit.split(Const.Delimiter.GROUP);
    for (let i = 0; i < groups.length; i++) {
      if (i >= Const.MAX_GROUPS) {
        break;
      }
      const g = groups[i];
      const items = g.split(Const.Delimiter.ITEM);
      const prizeGroup = new PrizeGroup();
      prizeGroup.groupId = items[0];
      prizeGroup.prizeNumber = parseInt(items[1], 10);
      prizeGroup.prizeWinner = parseInt(items[2], 10);
      this.prizeInfo.prizeGroups.push(prizeGroup);
    }
    for (let i = groups.length; i < Const.MAX_GROUPS; i++) {
      const prizeGroup = new PrizeGroup();
      this.prizeInfo.prizeGroups.push(prizeGroup);
    }
  }

  /**
   * 设置单选框
   */
  setCheckBox() {
    if (this.prizeInfo.prizeType === Const.PrizeType.CASH) {
      $('.ui.radio.checkbox.cash').checkbox('set checked');
      $('.ui.radio.checkbox.good').checkbox('set unchecked');
    } else {
      $('.ui.radio.checkbox.good').checkbox('set checked');
      $('.ui.radio.checkbox.cash').checkbox('set unchecked');
    }
    const that = this;
    $('.ui.radio.checkbox.cash').checkbox({
      onChange() {
        that.prizeInfo.prizeType = $('.ui.radio.checkbox.cash').checkbox('is checked') ? Const.PrizeType.CASH : Const.PrizeType.GOOD;
      }
    });
    $('.ui.radio.checkbox.good').checkbox({
      onChange() {
        that.prizeInfo.prizeType = $('.ui.radio.checkbox.good').checkbox('is checked') ? Const.PrizeType.GOOD : Const.PrizeType.CASH;
      }
    });
  }

  /**
   * 更新奖项信息
   */
  updatePrize() {
    let groupLimit = '';
    this.prizeInfo.prizeGroups.forEach(g => {
      if (g.groupId.length > 0 && g.prizeNumber > 0) {
        groupLimit = groupLimit + g.groupId + Const.Delimiter.ITEM + g.prizeNumber + Const.Delimiter.ITEM + '0' + Const.Delimiter.GROUP;
      }
    });
    if (groupLimit.length > 0) {
      groupLimit = groupLimit.substr(0, groupLimit.length - 1);
    }
    this.prizeInfo.groupLimit = groupLimit;
    if (this.editFlag === Const.EditFlag.ADD) {
      this.dialogTitle = '添加奖项';
      this.prizeService.add(this.prizeInfo).subscribe(result => this.postFinish(result), error => this.showError(error));
    } else {
      this.dialogTitle = '编辑奖项';
      this.prizeService.edit(this.prizeInfo).subscribe(result => this.postFinish(result), error => this.showError(error));
    }
  }

  /**
   * 设置抽奖顺序
   */
  setOrder(direct: number) {
    const setPrizes = this.prizeList.filter(e => e.selected);
    if (setPrizes.length === 0) {
      this.dialogTitle = '提示';
      this.dialogMessage = '请选择要调整顺序的奖项';
      this.dialog.modal('show');
      return;
    }
    this.prizeList.forEach(prize => {
      if (prize.selected) {
        if (direct === Const.Direct.UP) {
          prize.prizeOrder -= 110;
        } else {
          prize.prizeOrder += 110;
        }
      }
    });
    let orderNew = 1000;
    this.prizeList.sort((a, b) => a.prizeOrder - b.prizeOrder).forEach(prize => {
      if (prize.prizeOrder !== orderNew) {
        prize.prizeOrder = orderNew;
        this.prizeService.edit(prize).subscribe(result => {
          if (result.code === Const.ResultCode.SUCCESS) {
            console.log('### 设置抽奖顺序成功');
          } else {
            this.postFinish(result);
          }
        }, error => this.showError(error));
      }
      orderNew += 100;
    });
  }
}
