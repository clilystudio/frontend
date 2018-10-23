import { Component, OnInit } from '@angular/core';
import { OnsNavigator, Params } from 'ngx-onsenui/ngx-onsenui';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { PrizeInfo} from '../service/prizeInfo';
import { environment } from '../../environments/environment'

@Component({
  selector: 'ons-page',
  templateUrl: './lotto.component.html',
  styleUrls: ['./lotto.component.css']
})
export class LottoComponent implements OnInit {
  controlUrl = 'lottocontrol';

  prizeInfo: PrizeInfo;
  title: string;
  maxPerson: number;
  stompClient: Stomp.Client;

  constructor(private navigator: OnsNavigator, private params: Params) { 
    this.stompClient = Stomp.over(new SockJS(environment.api + this.controlUrl));
    let that = this;
    this.stompClient.connect({}, function(frame) {
      that.stompClient.subscribe("/status", (message) => {
        if(message.body) {
          console.log(message.body);
        }
      });
    });
    this.prizeInfo = params.data;
    this.maxPerson = this.prizeInfo.prizeNumber - this.prizeInfo.prizeWinner;
    if (this.prizeInfo.prizeStatus == 0) {
      this.title = "正在抽取" + this.prizeInfo.prizeName;
    } else {
      this.title = "准备抽取" + this.prizeInfo.prizeName;
      this.prizeInfo.prizePerson = Math.min(this.prizeInfo.prizePerson, this.maxPerson);
    }    
  }

  ngOnInit() {
  }

  
  startLotto() {
    console.log("###start");
  }

  stopLotto() {
    console.log("###stop");
  }
}
