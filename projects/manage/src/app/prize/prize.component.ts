import { Component, OnInit } from '@angular/core';
import { PrizeService } from './prize.service';
import { PrizeInfo} from './prizeInfo';
import { ApiResult } from '../service/result';
import { Dept } from '../service/dept';

declare var $: any;

@Component({
  selector: 'app-prize',
  templateUrl: './prize.component.html',
  styleUrls: ['./prize.component.css']
})
export class PrizeComponent implements OnInit {

  prizeList: PrizeInfo[];
  errorTitle: string;
  errorMessage: string;
  prizeInfo: PrizeInfo;
  editFlag: number;
  deptList = Dept.deptList;

  constructor(private prizeService: PrizeService) {
    this.prizeInfo = new PrizeInfo();
  }

  ngOnInit() {
    $("#menu21").popup({
      variation: 'inverted',
      content  : '添加奖项',
      target   : $("#menu21")
    });
    $("#menu22").popup({
      variation: 'inverted',
      content  : '删除奖项',
      target   : $("#menu22")
    });
    $("#menu23").popup({
      variation: 'inverted',
      content  : '批量导入',
      target   : $("#menu23")
    });
    $("#menu24").popup({
      variation: 'inverted',
      content  : '优先抽取',
      target   : $("#menu24")
    });
    $("#menu25").popup({
      variation: 'inverted',
      content  : '稍后抽取',
      target   : $("#menu25")
    });
  }

  uploadPrize(event) {
    $('.ui.page.dimmer').dimmer({closable: false}).dimmer('show');
    const file = event.target.files[0];
    const progress = this.prizeService.upload(file);
    progress.subscribe(result => this.postFinish(result, '导入员工数据失败'));
  }

  postFinish(result: ApiResult, title: string) {
    if (result.code == undefined) {
      $('.ui.page.dimmer').dimmer('hide');
      this.errorTitle = title;
      this.errorMessage = "网络访问异常";
      $('#errorTip').modal('show');
    } else if (result.code == "0") {
      this.listPrize();
    } else {
      $('.ui.page.dimmer').dimmer('hide');
      this.errorTitle = title;
      this.errorMessage = result.message;
      $('#errorTip').modal('show');
    }
  }

  public listPrize() {
    const progress = this.prizeService.list();
    progress.subscribe(prizeList => this.listFinish(prizeList));
  }

  listFinish(prizeList: PrizeInfo[]) {    
    $('.ui.page.dimmer').dimmer('hide');
    this.prizeList = prizeList;
  }

  removePrize() {
    let delPrizes = this.prizeList.filter(e => e.isSelected == true);
    let length = delPrizes.length;
    if (length == 0) {
      this.errorTitle = '提示';
      this.errorMessage = '请选择要删除的奖项';
      $('#errorTip').modal('show');
      return;
    }
    let length2 = delPrizes.filter(e => e.prizeWinner > 0 || e.prizeStatus != 0).length;
    if (length2 > 0) {
      this.errorTitle = '提示';
      this.errorMessage = '已抽奖的的奖项不能删除，请重新选择';
      $('#errorTip').modal('show');
      return;
    }
    let delPrizeIds = delPrizes.map(e => e.prizeId);
    const progress = this.prizeService.delete(delPrizeIds);
    progress.subscribe(result => this.postFinish(result, '删除奖项数据失败'));
  }

  newPrize() {
    this.editFlag = 0;
    this.prizeInfo = new PrizeInfo();
    $('#editPrizeWin').modal('show');
  }

  editPrize(prizeId) {
    console.log('###editPrize:' + prizeId);
    this.editFlag = 1;    
    this.prizeInfo = this.prizeList.find(e => e.prizeId == prizeId);
    $('#editPrizeWin').modal('show');
  }

  updatePrize() {
    if (this.editFlag == 0) {
      const progress = this.prizeService.add(this.prizeInfo);
      progress.subscribe(result => this.postFinish(result, '添加奖项数据失败'));
    } else {
      const progress = this.prizeService.edit(this.prizeInfo);
      progress.subscribe(result => this.postFinish(result, '编辑奖项数据失败'));
    }
  }

  setOrder(direct: number) {
    let setPrizes = this.prizeList.filter(e => e.isSelected == true);
    let length = setPrizes.length;
    if (length == 0) {
      this.errorTitle = '提示';
      this.errorMessage = '请选择要调整顺序的奖项';
      $('#errorTip').modal('show');
      return;
    }
    let order = 1000;
    let subOrder = 0;
    this.prizeList.forEach(prize => {
      if (prize.isSelected) {
        subOrder += 10;
        if (direct == 0) {
          prize.prizeOrder = order - 1000 + subOrder;
        } else {
          prize.prizeOrder = order + 1000 + subOrder;
        }
      } else {
        order += 1000;
        prize.prizeOrder = order;
      }
    });
    let orderNew = 1000;
    this.prizeList.sort((a, b) => a.prizeOrder - b.prizeOrder)
      .forEach(prize => {
        prize.prizeOrder = orderNew;
        orderNew += 1000;
        const progress = this.prizeService.edit(prize);
        progress.subscribe(result => console.log("###" + JSON.stringify(result)));
    });
  }
}
