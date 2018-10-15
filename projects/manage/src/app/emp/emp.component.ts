import { Component, OnInit } from '@angular/core';
import { UploadService } from './upload.service';
import { empInfo} from './empInfo';

declare var $: any;

@Component({
  selector: 'app-emp',
  templateUrl: './emp.component.html',
  styleUrls: ['./emp.component.css']
})
export class EmpComponent implements OnInit {

  empList: empInfo[];
  errorMessage: string;

  constructor(private uploadService: UploadService) { }

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

  uploadEmp(event) {
    $('.ui.page.dimmer').dimmer({closable: false}).dimmer('show');
    const file = event.target.files[0];
    console.log('### uploadEmp!' + file.name);
    const progress = this.uploadService.upload(file, 'emp/upload');
    progress.subscribe(result => this.uploadFinish(result));
  }

  uploadFinish(result) {
    $('.ui.page.dimmer').dimmer('hide');
    $('#errorTip').modal('show');
    const code = result["code"];
    const message = result["message"];
    if (code === "0") {

    } else {

    }
  }
}
