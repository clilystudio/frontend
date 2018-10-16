import { Component, OnInit } from '@angular/core';
import { EmpService } from './emp.service';
import { EmpInfo} from './empInfo';
import { ApiResult } from '../service/result';

declare var $: any;

@Component({
  selector: 'app-emp',
  templateUrl: './emp.component.html',
  styleUrls: ['./emp.component.css']
})
export class EmpComponent implements OnInit {

  empList: EmpInfo[];
  errorMessage: string;

  constructor(private empService: EmpService) { }

  ngOnInit() {
    $("#menu1").popup({
      variation: 'inverted',
      content  : '添加员工',
      target   : $("#menu1")
    });
    $("#menu2").popup({
      variation: 'inverted',
      content  : '删除员工',
      target   : $("#menu2")
    });
    $("#menu3").popup({
      variation: 'inverted',
      content  : '批量导入',
      target   : $("#menu3")
    });
    this.listEmp();
  }

  uploadEmp(event) {
    $('.ui.page.dimmer').dimmer({closable: false}).dimmer('show');
    const file = event.target.files[0];
    const progress = this.empService.upload(file);
    progress.subscribe(result => this.uploadFinish(result));
  }

  uploadFinish(result: ApiResult) {
    if (result.code == "0") {
      this.listEmp();
    } else {
      $('.ui.page.dimmer').dimmer('hide');
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
    this.empList = empList;
  }
}
