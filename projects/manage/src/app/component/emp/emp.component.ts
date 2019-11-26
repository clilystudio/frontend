import { Component, OnInit } from '@angular/core';
import { EmpService } from '../../../../../common/service/emp.service';
import { Const } from '../../../../../common/const';
import { EmpInfo } from '../../../../../common/dto/empInfo';
import { ApiResult } from '../../../../../common/dto/api-result';

declare var $: any;

/**
 * 员工管理组件
 */
@Component({
  selector: 'app-emp',
  templateUrl: './emp.component.html',
  styleUrls: ['./emp.component.css']
})
export class EmpComponent implements OnInit {

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

  // 员工一览列表
  empList: EmpInfo[];

  // 编辑中的员工信息
  empInfo: EmpInfo;

  constructor(private empService: EmpService) {
    this.empInfo = new EmpInfo();
  }

  ngOnInit() {
    $('#menu11').popup({
      variation: 'inverted',
      content: '添加员工',
      target: $('#menu11')
    });
    $('#menu12').popup({
      variation: 'inverted',
      content: '删除员工',
      target: $('#menu12')
    });
    $('#menu13').popup({
      variation: 'inverted',
      content: '批量导入',
      target: $('#menu13')
    });
    this.dimmer = $('#dimmerEmp');
    this.dialog = $('#dialogEmp');
    $('.ui.radio.checkbox').checkbox();
  }

  /**
   * 批量上传员工数据
   * @param event 文件上传组件事件
   */
  uploadEmp(event: any) {
    this.dimmer.dimmer({ closable: false }).dimmer('show');
    const file = event.target.files[0];
    this.dialogTitle = '批量导入';
    this.empService.upload(file).subscribe(result => this.postFinish(result), error => this.showError(error));
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
      this.listEmp();
    } else {
      this.dialogMessage = result.message;
      this.dialog.modal('show');
    }
  }

  /**
   * 显示员工一览
   */
  public listEmp() {
    this.empService.list().subscribe(empList => {
      this.empList = empList.sort((a, b) => a.empId.localeCompare(b.empId));
      this.dimmer.dimmer('hide');
    }, error => this.showError(error));
  }

  /**
   * 删除员工
   */
  removeEmp() {
    const delEmps = this.empList.filter(e => e.selected === true);
    if (delEmps.length === 0) {
      this.dialogTitle = '提示';
      this.dialogMessage = '请选择要删除的员工';
      this.dialog.modal('show');
      return;
    }
    if (delEmps.find(e => e.prizeFlag === Const.PrizeFlag.WIN)) {
      this.dialogTitle = '提示';
      this.dialogMessage = '已中奖员工不能删除，请重新选择';
      this.dialog.modal('show');
      return;
    }
    this.dialogTitle = '删除员工';
    const delEmpIds = delEmps.map(e => e.empId);
    this.empService.delete(delEmpIds).subscribe(result => this.postFinish(result), error => this.showError(error));
  }

  /**
   * 添加员工
   */
  newEmp() {
    this.editFlag = Const.EditFlag.ADD;
    this.empInfo = new EmpInfo();
    this.setCheckBox();
    $('#editwinEmp').modal('show');
  }

  /**
   * 修改员工
   */
  editEmp(empId: string) {
    this.editFlag = Const.EditFlag.EDIT;
    this.empInfo = this.empList.find(e => e.empId === empId);
    if (this.empInfo.prizeFlag === Const.PrizeFlag.WIN) {
      this.dialogTitle = '提示';
      this.dialogMessage = '已中奖的员工不能修改';
      this.dialog.modal('show');
    } else {
      this.setCheckBox();
      $('#editwinEmp').modal('show');
    }
  }

  /**
   * 设置单选框
   */
  setCheckBox() {
    if (this.empInfo.empSex === Const.SexFlag.MALE) {
      $('.ui.radio.checkbox.male').checkbox('set checked');
      $('.ui.radio.checkbox.female').checkbox('set unchecked');
    } else {
      $('.ui.radio.checkbox.female').checkbox('set checked');
      $('.ui.radio.checkbox.male').checkbox('set unchecked');
    }
    const that = this;
    $('.ui.radio.checkbox.male').checkbox({
      onChange() {
        that.empInfo.empSex = $('.ui.radio.checkbox.male').checkbox('is checked') ? Const.SexFlag.MALE : Const.SexFlag.FEMALE;
      }
    });
    $('.ui.radio.checkbox.female').checkbox({
      onChange() {
        that.empInfo.empSex = $('.ui.radio.checkbox.female').checkbox('is checked') ? Const.SexFlag.FEMALE : Const.SexFlag.MALE;
      }
    });
  }

  /**
   * 更新员工信息
   */
  updateEmp() {
    this.empInfo.deptName = Const.DeptList.find(e => e.deptId === this.empInfo.deptId).deptName;
    if (this.editFlag === Const.EditFlag.ADD) {
      this.dialogTitle = '添加员工';
      this.empService.add(this.empInfo).subscribe(result => this.postFinish(result), error => this.showError(error));
    } else {
      this.dialogTitle = '编辑员工';
      this.empService.edit(this.empInfo).subscribe(result => this.postFinish(result), error => this.showError(error));
    }
  }
}
