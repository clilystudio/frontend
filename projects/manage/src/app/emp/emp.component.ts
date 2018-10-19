import { Component, OnInit } from '@angular/core';
import { EmpService } from './emp.service';
import { EmpInfo} from './empInfo';
import { ApiResult } from '../service/result';
import { Dept } from '../service/dept';

declare var $: any;

@Component({
  selector: 'app-emp',
  templateUrl: './emp.component.html',
  styleUrls: ['./emp.component.css']
})
export class EmpComponent implements OnInit {

  empList: EmpInfo[];
  errorTitle: string;
  errorMessage: string;
  empInfo: EmpInfo;
  editFlag: number;
  deptList = Dept.deptList;

  constructor(private empService: EmpService) {
    this.empInfo = new EmpInfo();
    //this.deptList = [{"deptId":"ID010","deptName":"事业一部"},{"deptId":"ID020","deptName":"事业二部"},{"deptId":"ID030","deptName":"事业三部"}];
  }

  ngOnInit() {
    $("#menu11").popup({
      variation: 'inverted',
      content  : '添加员工',
      target   : $("#menu11")
    });
    $("#menu12").popup({
      variation: 'inverted',
      content  : '删除员工',
      target   : $("#menu12")
    });
    $("#menu13").popup({
      variation: 'inverted',
      content  : '批量导入',
      target   : $("#menu13")
    });
  }

  uploadEmp(event) {
    $('.ui.page.dimmer').dimmer({closable: false}).dimmer('show');
    const file = event.target.files[0];
    const progress = this.empService.upload(file);
    progress.subscribe(result => this.postFinish(result, '导入员工数据失败'));
  }

  postFinish(result: ApiResult, title: string) {
    if (result.code == undefined) {
      $('.ui.page.dimmer').dimmer('hide');
      this.errorTitle = title;
      this.errorMessage = "网络访问异常";
      $('#errorTip').modal('show');
    } else if (result.code == "0") {
      this.listEmp();
    } else {
      $('.ui.page.dimmer').dimmer('hide');
      this.errorTitle = title;
      this.errorMessage = result.message;
      $('#errorTip').modal('show');
    }
  }

  public listEmp() {
    const progress = this.empService.list();
    progress.subscribe(empList => this.listFinish(empList));
  }

  listFinish(empList: EmpInfo[]) {    
    $('.ui.page.dimmer').dimmer('hide');
    this.empList = empList.sort((a, b) => a.empId.localeCompare(b.empId));
  }

  removeEmp() {
    let delEmps = this.empList.filter(e => e.isSelected == true);
    let length = delEmps.length;
    if (length == 0) {
      this.errorTitle = '提示';
      this.errorMessage = '请选择要删除的员工';
      $('#errorTip').modal('show');
      return;
    }
    let length2 = delEmps.filter(e => e.prizeFlag != 0).length;
    if (length2 > 0) {
      this.errorTitle = '提示';
      this.errorMessage = '已中奖或已弃奖的员工不能删除，请重新选择';
      $('#errorTip').modal('show');
      return;
    }
    let delEmpIds = delEmps.map(e => e.empId);
    const progress = this.empService.delete(delEmpIds);
    progress.subscribe(result => this.postFinish(result, '删除员工数据失败'));
  }

  newEmp() {
    this.editFlag = 0;
    this.empInfo = new EmpInfo();
    $('#editEmpWin').modal('show');
  }

  editEmp(empId) {
    console.log('###editEmp:' + empId);
    this.editFlag = 1;    
    this.empInfo = this.empList.find(e => e.empId == empId);
    if (this.empInfo.prizeFlag != 0) {
      this.errorTitle = '提示';
      this.errorMessage = '已中奖的员工不能修改';
      $('#errorTip').modal('show');
    } else {
      $('#editEmpWin').modal('show');
    }
  }

  updateEmp() {
    this.empInfo.deptName = this.deptList.find(e => e.deptId == this.empInfo.deptId).deptName;
    if (this.editFlag == 0) {
      const progress = this.empService.add(this.empInfo);
      progress.subscribe(result => this.postFinish(result, '添加员工数据失败'));
    } else {
      const progress = this.empService.edit(this.empInfo);
      progress.subscribe(result => this.postFinish(result, '编辑员工数据失败'));
    }
  }
}
