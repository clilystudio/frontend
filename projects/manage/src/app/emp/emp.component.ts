import { Component, OnInit } from '@angular/core';

declare var $: any;

@Component({
  selector: 'app-emp',
  templateUrl: './emp.component.html',
  styleUrls: ['./emp.component.css']
})
export class EmpComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    $("#menu1").popup({
      variation: 'inverted',
      content  : '添加员工',
      target   : $("#menu1")
    })
    $("#menu2").popup({
      variation: 'inverted',
      content  : '删除员工',
      target   : $("#menu2")
    })
    $("#menu3").popup({
      variation: 'inverted',
      content  : '批量导入',
      target   : $("#menu3")
    })
  }
}
